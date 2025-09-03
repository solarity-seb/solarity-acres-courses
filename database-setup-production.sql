-- PRODUCTION DATABASE SETUP SCRIPT
-- Run this in Supabase SQL Editor after creating your project

-- ==============================================
-- 1. ENABLE ROW LEVEL SECURITY EXTENSIONS
-- ==============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 2. CREATE USER RESOURCES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS user_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress FLOAT DEFAULT 0.0 CHECK (progress >= 0.0 AND progress <= 1.0),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_resources_user_id ON user_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resources_resource_id ON user_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_resources_completed ON user_resources(completed_at) WHERE completed_at IS NOT NULL;

-- ==============================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE user_resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can only see their own resources" ON user_resources;
DROP POLICY IF EXISTS "Users can insert their own resources" ON user_resources;
DROP POLICY IF EXISTS "Users can update their own resources" ON user_resources;
DROP POLICY IF EXISTS "Users can delete their own resources" ON user_resources;

-- Create comprehensive RLS policies
CREATE POLICY "Users can view their own resources" ON user_resources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resources" ON user_resources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resources" ON user_resources
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resources" ON user_resources
  FOR DELETE USING (auth.uid() = user_id);

-- ==============================================
-- 4. CREATE STORAGE BUCKET FOR PROFILE IMAGES
-- ==============================================

-- Create profile images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-images',
  'profile-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- ==============================================
-- 5. SET UP STORAGE POLICIES
-- ==============================================

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
DROP POLICY IF EXISTS "Public access to profile images" ON storage.objects;

-- Create storage policies for profile images
CREATE POLICY "Users can upload profile images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view profile images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');

CREATE POLICY "Users can update their own profile images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  ) WITH CHECK (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ==============================================
-- 6. CREATE UPDATED_AT TRIGGER
-- ==============================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_resources
DROP TRIGGER IF EXISTS update_user_resources_updated_at ON user_resources;
CREATE TRIGGER update_user_resources_updated_at
  BEFORE UPDATE ON user_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 7. CREATE HELPFUL VIEWS (OPTIONAL)
-- ==============================================

-- View for user resource statistics
CREATE OR REPLACE VIEW user_resource_stats AS
SELECT 
  user_id,
  COUNT(*) as total_resources,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) as completed_resources,
  COUNT(*) FILTER (WHERE progress > 0) as started_resources,
  AVG(progress) as average_progress,
  MAX(last_accessed) as last_activity
FROM user_resources
GROUP BY user_id;

-- ==============================================
-- 8. GRANT NECESSARY PERMISSIONS
-- ==============================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON user_resources TO authenticated;
GRANT SELECT ON user_resource_stats TO authenticated;

-- ==============================================
-- 9. INSERT SAMPLE DATA (OPTIONAL - REMOVE IN PRODUCTION)
-- ==============================================

-- Uncomment the following lines if you want to test with sample data:

/*
-- Sample resource enrollment (replace with actual user ID after first user registers)
INSERT INTO user_resources (user_id, resource_id, progress) 
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'soil-health-guide', 0.0),
  ('00000000-0000-0000-0000-000000000000', 'organic-pest-control-mastery', 0.0)
ON CONFLICT (user_id, resource_id) DO NOTHING;
*/

-- ==============================================
-- 10. VERIFICATION QUERIES
-- ==============================================

-- Run these queries to verify everything was created correctly:

-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_resources');

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'user_resources';

-- Check storage bucket
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'profile-images';

-- Check storage policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' 
AND tablename = 'objects';

-- ==============================================
-- SETUP COMPLETE!
-- ==============================================

-- Your database is now ready for production use.
-- Next steps:
-- 1. Configure your .env.local file with the Supabase credentials
-- 2. Test user registration and resource enrollment
-- 3. Deploy to Vercel with environment variables
-- 4. Configure Flarum integration
-- 5. Set up AWS S3 (optional)

SELECT 'Database setup completed successfully!' as status;
