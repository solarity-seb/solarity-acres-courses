import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Database table will be created automatically when first accessed via Supabase client',
      instructions: 'Please create the user_resources table manually in Supabase dashboard with the provided SQL schema'
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};

export const GET: RequestHandler = async () => {
  const schema = `
-- User Resources Table Schema
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS user_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  completed BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- Enable Row Level Security
ALTER TABLE user_resources ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy
CREATE POLICY "Users can manage their own resources" ON user_resources
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_resources_user_id ON user_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resources_resource_id ON user_resources(resource_id);
  `;

  return new Response(schema, {
    status: 200,
    headers: { 'Content-Type': 'text/plain' }
  });
};
