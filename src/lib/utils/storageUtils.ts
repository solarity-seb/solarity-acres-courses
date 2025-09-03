import type { SupabaseClient } from '@supabase/supabase-js';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload profile image to Supabase storage
 * @param file - File object to upload
 * @param userId - User ID for folder organization
 * @param supabaseClient - Supabase client instance (optional, uses default if not provided)
 * @param onProgress - Optional progress callback
 * @returns Upload result with URL or error
 */
export async function uploadProfileImage(
  file: File, 
  userId: string,
  supabaseClient?: SupabaseClient,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
    // Use provided client or import default (client-side only)
    let supabase = supabaseClient;
    if (!supabase) {
      if (typeof window === 'undefined') {
        throw new Error('Supabase client must be provided for server-side usage');
      }
      const { supabase: defaultClient } = await import('$lib/supabaseClient');
      supabase = defaultClient;
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

    // Validate image dimensions (optional)
    const isValidDimensions = await validateImageDimensions(file);
    if (!isValidDimensions) {
      return { success: false, error: 'Image dimensions must be at least 100x100 pixels' };
    }

    // Delete existing profile image first
    await deleteExistingProfileImages(userId, supabase);

    // Create unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const fileName = `${userId}/profile-${timestamp}.${fileExt}`;
    
    // Upload file with progress tracking
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(fileName);

    // Verify the upload was successful
    const { data: fileData, error: checkError } = await supabase.storage
      .from('profile-images')
      .list(userId);

    if (checkError) {
      console.warn('Could not verify upload:', checkError);
    }

    return { 
      success: true, 
      url: publicUrl,
      path: fileName
    };
  } catch (error: any) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed: ' + error.message };
  }
}

/**
 * Delete profile image from Supabase storage
 * @param imageUrl - URL or path of the image to delete
 * @param supabaseClient - Supabase client instance
 * @returns True if successful, false otherwise
 */
export async function deleteProfileImage(imageUrl: string, supabaseClient?: SupabaseClient): Promise<boolean> {
  try {
    if (!imageUrl) return true;

    // Use provided client or import default (client-side only)
    let supabase = supabaseClient;
    if (!supabase) {
      if (typeof window === 'undefined') {
        throw new Error('Supabase client must be provided for server-side usage');
      }
      const { supabase: defaultClient } = await import('$lib/supabaseClient');
      supabase = defaultClient;
    }

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

    const { error } = await supabase.storage
      .from('profile-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}

/**
 * Delete all existing profile images for a user
 * @param userId - User ID
 * @param supabaseClient - Supabase client instance
 * @returns True if successful
 */
export async function deleteExistingProfileImages(userId: string, supabaseClient?: SupabaseClient): Promise<boolean> {
  try {
    // Use provided client or import default (client-side only)
    let supabase = supabaseClient;
    if (!supabase) {
      if (typeof window === 'undefined') {
        throw new Error('Supabase client must be provided for server-side usage');
      }
      const { supabase: defaultClient } = await import('$lib/supabaseClient');
      supabase = defaultClient;
    }

    // List all files in the user's folder
    const { data: files, error: listError } = await supabase.storage
      .from('profile-images')
      .list(userId);

    if (listError) {
      console.error('Error listing files:', listError);
      return false;
    }

    if (!files || files.length === 0) {
      return true; // No files to delete
    }

    // Delete all files
    const filePaths = files.map((file: any) => `${userId}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from('profile-images')
      .remove(filePaths);

    if (deleteError) {
      console.error('Error deleting files:', deleteError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete existing images:', error);
    return false;
  }
}

/**
 * Get profile image URL for a user
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns Profile image URL or null
 */
export async function getProfileImageUrl(supabase: any, userId: string): Promise<string | null> {
  try {
    const { data: files, error } = await supabase.storage
      .from('profile-images')
      .list(userId);

    if (error || !files || files.length === 0) {
      return null;
    }

    // Get the most recent profile image
    const profileFiles = files.filter((file: any) => file.name.startsWith('profile-'));
    if (profileFiles.length === 0) {
      return null;
    }

    // Sort by created date and get the latest
    const latestFile = profileFiles.sort((a: any, b: any) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )[0];

    const { data: { publicUrl } } = supabase.storage
      .from('profile-images')
      .getPublicUrl(`${userId}/${latestFile.name}`);

    return publicUrl;
  } catch (error) {
    console.error('Error getting profile image URL:', error);
    return null;
  }
}

/**
 * Validate image dimensions
 * @param file - Image file to validate
 * @returns True if dimensions are valid
 */
async function validateImageDimensions(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      // Minimum dimensions: 100x100, maximum: 2048x2048
      const isValid = img.width >= 100 && img.height >= 100 && 
                     img.width <= 2048 && img.height <= 2048;
      resolve(isValid);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
}

/**
 * Compress image before upload (optional utility)
 * @param file - Original image file
 * @param quality - Compression quality (0-1)
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Compressed file
 */
export async function compressImage(
  file: File, 
  quality: number = 0.8,
  maxWidth: number = 800,
  maxHeight: number = 800
): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Return original if compression fails
        }
      }, file.type, quality);
    };
    
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate thumbnail from image
 * @param file - Original image file
 * @param size - Thumbnail size (square)
 * @returns Thumbnail file
 */
export async function generateThumbnail(file: File, size: number = 150): Promise<File> {
  return compressImage(file, 0.9, size, size);
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

/**
 * Get storage usage statistics for a user
 * @param supabase - Supabase client instance
 * @param userId - User ID
 * @returns Storage usage info
 */
export async function getStorageUsage(supabase: any, userId: string): Promise<{
  fileCount: number;
  totalSize: number;
  files: Array<{ name: string; size: number; created: string }>;
}> {
  try {
    const { data: files, error } = await supabase.storage
      .from('profile-images')
      .list(userId);

    if (error || !files) {
      return { fileCount: 0, totalSize: 0, files: [] };
    }

    const totalSize = files.reduce((sum: number, file: any) => sum + (file.metadata?.size || 0), 0);
    
    const fileDetails = files.map((file: any) => ({
      name: file.name,
      size: file.metadata?.size || 0,
      created: file.created_at || ''
    }));

    return {
      fileCount: files.length,
      totalSize,
      files: fileDetails
    };
  } catch (error) {
    console.error('Error getting storage usage:', error);
    return { fileCount: 0, totalSize: 0, files: [] };
  }
}
