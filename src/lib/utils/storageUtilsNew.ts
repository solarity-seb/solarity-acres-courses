import type { SupabaseClient } from '@supabase/supabase-js';
import { checkRateLimit, getClientIdentifier } from './rateLimit';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
  rateLimited?: boolean;
}

/**
 * Upload profile image to Supabase storage (client-side only)
 * @param file - File object to upload
 * @param userId - User ID for folder organization
 * @param supabase - Supabase client instance
 * @param clientIdentifier - Client IP or identifier for rate limiting
 * @returns Upload result with URL or error
 */
export async function uploadProfileImage(
  file: File, 
  userId: string,
  supabase: SupabaseClient,
  clientIdentifier: string = 'unknown'
): Promise<UploadResult> {
  try {
    // Check rate limit
    const rateLimitResult = checkRateLimit(clientIdentifier, 'FILE_UPLOAD');
    if (!rateLimitResult.allowed) {
      return { 
        success: false, 
        error: `Upload rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
        rateLimited: true
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // Additional security checks
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    // Create unique filename with timestamp and random string
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}/profile-${timestamp}-${randomStr}.${fileExt}`;
    
    console.log('Uploading file:', fileName);
    
    // Upload file with additional options
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        duplex: 'half' // Important for proper streaming
      });

    if (error) {
      console.error('Upload error:', error);
      
      // Handle specific error types
      if (error.message.includes('row-level security')) {
        return { success: false, error: 'Permission denied. Please ensure you are logged in.' };
      }
      
      if (error.message.includes('duplicate')) {
        return { success: false, error: 'A file with this name already exists. Please try again.' };
      }
      
      if (error.message.includes('size')) {
        return { success: false, error: 'File size exceeds limit. Please choose a smaller file.' };
      }
      
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);

    // Verify the upload by checking if the file exists
    const { data: fileCheck, error: checkError } = await supabase.storage
      .from('profile-images')
      .list(userId, { search: `profile-${timestamp}-${randomStr}` });

    if (checkError || !fileCheck?.length) {
      console.warn('Could not verify upload:', checkError);
    }

    return { 
      success: true, 
      url: publicUrl,
      path: fileName
    };
  } catch (error: any) {
    console.error('Upload failed:', error);
    
    // Handle network errors
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return { success: false, error: 'Network error. Please check your connection and try again.' };
    }
    
    // Handle timeout errors
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return { success: false, error: 'Upload timed out. Please try again with a smaller file.' };
    }
    
    return { success: false, error: 'Upload failed: ' + (error.message || 'Unknown error') };
  }
}

/**
 * Delete profile image from Supabase storage (client-side only)
 * @param imageUrl - URL or path of the image to delete
 * @param supabase - Supabase client instance
 * @returns True if successful, false otherwise
 */
export async function deleteProfileImage(imageUrl: string, supabase: SupabaseClient): Promise<boolean> {
  try {
    if (!imageUrl) return true;

    // Extract file path from URL
    let filePath: string;
    
    if (imageUrl.includes('/storage/v1/object/public/profile-images/')) {
      // Extract path from full URL
      const urlParts = imageUrl.split('/storage/v1/object/public/profile-images/');
      filePath = urlParts[1];
    } else if (imageUrl.includes('/')) {
      // Assume it's already a path
      filePath = imageUrl;
    } else {
      console.warn('Invalid image URL format:', imageUrl);
      return false;
    }

    // Validate file path format (userId/filename)
    if (!filePath.includes('/') || filePath.startsWith('/') || filePath.endsWith('/')) {
      console.warn('Invalid file path format:', filePath);
      return false;
    }

    const { error } = await supabase.storage
      .from('profile-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      
      // Handle specific error types
      if (error.message.includes('not found')) {
        console.info('File not found, considering as successfully deleted');
        return true;
      }
      
      if (error.message.includes('row-level security')) {
        console.error('Permission denied for file deletion');
        return false;
      }
      
      return false;
    }

    console.log('Successfully deleted file:', filePath);
    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

/**
 * Validate file type and size
 * @param file - File to validate
 * @returns Validation result
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }
  
  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!supportedTypes.includes(file.type)) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, WebP, GIF' };
  }
  
  return { valid: true };
}
