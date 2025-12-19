-- Create storage bucket for generated media
INSERT INTO storage.buckets (id, name, public)
VALUES ('generated-media', 'generated-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for generated-media bucket
CREATE POLICY "Users can view their own generated media"
ON storage.objects FOR SELECT
USING (bucket_id = 'generated-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own generated media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'generated-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own generated media"
ON storage.objects FOR DELETE
USING (bucket_id = 'generated-media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create generated_media table for tracking gallery items
CREATE TABLE IF NOT EXISTS public.generated_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  media_type TEXT NOT NULL, -- 'image', 'video', 'document', 'presentation', 'spreadsheet', 'pdf'
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt TEXT,
  style TEXT,
  metadata JSONB DEFAULT '{}',
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on generated_media
ALTER TABLE public.generated_media ENABLE ROW LEVEL SECURITY;

-- RLS policies for generated_media
CREATE POLICY "Users can view their own media"
ON public.generated_media FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own media"
ON public.generated_media FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

CREATE POLICY "Users can update their own media"
ON public.generated_media FOR UPDATE
USING (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own media"
ON public.generated_media FOR DELETE
USING (auth.uid() IS NOT NULL AND auth.uid()::text = user_id);

-- Create index for faster lookups
CREATE INDEX idx_generated_media_user_id ON public.generated_media(user_id);
CREATE INDEX idx_generated_media_media_type ON public.generated_media(media_type);
CREATE INDEX idx_generated_media_created_at ON public.generated_media(created_at DESC);