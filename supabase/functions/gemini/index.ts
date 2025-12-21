// Supabase Edge Function (Deno) example: /supabase/functions/gemini
// Deploy this with `supabase functions deploy gemini --project <project-ref>`
// The function expects an env var `GEMINI_API_KEY` set in Supabase secrets.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const prompt = body.prompt || '';

    const API_KEY = Deno.env.get('GEMINI_API_KEY') || '';
    if (!API_KEY) return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // TODO: Adjust to the real Gemini REST endpoint provided by your LLM provider.
    const GEN_URL = 'https://api.gemini.example/v1/generate';

    const resp = await fetch(GEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const json = await resp.json();
    return new Response(JSON.stringify({ ok: true, data: json }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
