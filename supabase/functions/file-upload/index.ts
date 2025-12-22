import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// STUB: Google Cloud Storage integration
// To enable GCS, set these environment variables:
// - GCS_PROJECT_ID
// - GCS_BUCKET_NAME  
// - GCS_SERVICE_ACCOUNT_KEY (JSON string)

interface UploadResult {
  id: string;
  filename: string;
  publicUrl: string;
  storagePath: string;
  provider: 'gcs' | 'local';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for GCS configuration
    const gcsProjectId = Deno.env.get('GCS_PROJECT_ID');
    const gcsBucket = Deno.env.get('GCS_BUCKET_NAME');
    const gcsKey = Deno.env.get('GCS_SERVICE_ACCOUNT_KEY');
    
    const useGCS = gcsProjectId && gcsBucket && gcsKey;

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    let result: UploadResult;

    if (useGCS) {
      // STUB: GCS upload implementation
      // When ready, implement using Google Cloud Storage client
      console.log('GCS upload stub - would upload to:', gcsBucket, filename);
      
      // For now, fall back to recording metadata only
      result = {
        id: crypto.randomUUID(),
        filename,
        publicUrl: `https://storage.googleapis.com/${gcsBucket}/${filename}`,
        storagePath: `gs://${gcsBucket}/${filename}`,
        provider: 'gcs',
      };
      
      console.warn('GCS upload is stubbed - file not actually uploaded. Implement GCS client for production.');
    } else {
      // Local/Supabase fallback - just record metadata
      console.log('Using local metadata storage (no GCS configured)');
      
      result = {
        id: crypto.randomUUID(),
        filename,
        publicUrl: '', // No actual storage
        storagePath: `local/${filename}`,
        provider: 'local',
      };
    }

    // Record upload metadata in database
    const { data: insertData, error: insertError } = await supabase
      .from('file_uploads')
      .insert({
        id: result.id,
        filename: result.filename,
        original_name: file.name,
        mime_type: file.type,
        size_bytes: bytes.length,
        storage_path: result.storagePath,
        public_url: result.publicUrl || null,
        storage_provider: result.provider,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record upload metadata' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Upload recorded:', result.id);

    return new Response(
      JSON.stringify({ ok: true, upload: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error in file-upload function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
