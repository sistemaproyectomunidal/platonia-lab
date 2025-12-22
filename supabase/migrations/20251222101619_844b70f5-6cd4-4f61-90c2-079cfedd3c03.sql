-- Lab demos table for storing AI prompt analysis results
CREATE TABLE public.lab_demos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  summary TEXT NOT NULL,
  axes TEXT[] DEFAULT '{}',
  matched_nodes TEXT[] DEFAULT '{}',
  questions JSONB DEFAULT '[]'::jsonb,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lab_demos ENABLE ROW LEVEL SECURITY;

-- Public insert policy (anyone can submit a demo)
CREATE POLICY "Anyone can insert lab demos"
ON public.lab_demos
FOR INSERT
WITH CHECK (true);

-- Public read policy (anyone can read demos)
CREATE POLICY "Anyone can read lab demos"
ON public.lab_demos
FOR SELECT
USING (true);

-- Podcast episodes table for storing episode metadata
CREATE TABLE public.podcast_episodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT,
  transcript_key TEXT,
  duration INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.podcast_episodes ENABLE ROW LEVEL SECURITY;

-- Public read policy for published episodes
CREATE POLICY "Anyone can read published episodes"
ON public.podcast_episodes
FOR SELECT
USING (is_published = true);

-- Corpus entries table for philosophical texts
CREATE TABLE public.corpus_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  axes TEXT[] DEFAULT '{}',
  related_nodes TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.corpus_entries ENABLE ROW LEVEL SECURITY;

-- Public read policy for published entries
CREATE POLICY "Anyone can read published corpus entries"
ON public.corpus_entries
FOR SELECT
USING (status = 'published');

-- Map nodes table for conceptual graph
CREATE TABLE public.map_nodes (
  id TEXT NOT NULL PRIMARY KEY,
  label TEXT NOT NULL,
  axis TEXT NOT NULL,
  description TEXT,
  position_x FLOAT DEFAULT 0,
  position_y FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.map_nodes ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can read map nodes"
ON public.map_nodes
FOR SELECT
USING (true);

-- Socratic questions table
CREATE TABLE public.socratic_questions (
  id TEXT NOT NULL PRIMARY KEY,
  text TEXT NOT NULL,
  axis TEXT NOT NULL,
  related_nodes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.socratic_questions ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can read socratic questions"
ON public.socratic_questions
FOR SELECT
USING (true);

-- File uploads table (metadata for GCS files)
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_provider TEXT DEFAULT 'gcs' CHECK (storage_provider IN ('gcs', 'supabase')),
  storage_path TEXT NOT NULL,
  public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Anyone can read file uploads"
ON public.file_uploads
FOR SELECT
USING (true);