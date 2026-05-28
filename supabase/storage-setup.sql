-- Ghost Coach Storage Setup
-- Run this in your Supabase SQL Editor after creating the bucket in Dashboard

-- Create bucket via Dashboard: Storage > New Bucket
-- Name: stance-images
-- Public: true (for public image URLs)

-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('stance-images', 'stance-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for stance images"
ON storage.objects FOR SELECT
USING (bucket_id = 'stance-images');

-- Allow service role to upload (backend uses service key)
CREATE POLICY "Service role can upload stance images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'stance-images');

CREATE POLICY "Service role can update stance images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'stance-images');

CREATE POLICY "Service role can delete stance images"
ON storage.objects FOR DELETE
USING (bucket_id = 'stance-images');
