-- Allow authenticated users to upload to exercise-videos
CREATE POLICY "Allow authenticated uploads to exercise-videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'exercise-videos');

-- Allow anyone to view videos in exercise-videos (since it's a library)
CREATE POLICY "Allow authenticated viewing of exercise-videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'exercise-videos');

-- Allow deletion
CREATE POLICY "Allow authenticated deletion from exercise-videos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'exercise-videos');
