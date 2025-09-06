// Migration utility to switch between Supabase and S3 storage
import type { UploadResult } from './storageUtils';

// Current storage backend - change this to switch storage providers
type StorageBackend = 'supabase' | 's3';
const CURRENT_STORAGE: StorageBackend = 's3'; // Now using S3!

/**
 * Universal upload function that works with both Supabase and S3
 * @param file - File to upload
 * @param userId - User ID
 * @param supabaseClient - Supabase client (only needed for Supabase backend)
 * @returns Upload result
 */
export async function uploadProfileImage(
  file: File,
  userId: string,
  supabaseClient?: any
): Promise<UploadResult> {
  if (CURRENT_STORAGE === 's3') {
    // Use S3 storage
    const { uploadProfileImage: s3Upload } = await import('./s3StorageUtils');
    return s3Upload(file, userId);
  } else {
    // Use Supabase storage (current implementation)
    const { uploadProfileImage: supabaseUpload } = await import('./storageUtilsNew');
    if (!supabaseClient) {
      throw new Error('Supabase client required for Supabase storage');
    }
    const clientIdentifier = 'web-client'; // You might want to make this dynamic
    return supabaseUpload(file, userId, supabaseClient, clientIdentifier);
  }
}

/**
 * Universal delete function that works with both Supabase and S3
 * @param imageUrl - Image URL to delete
 * @param supabaseClient - Supabase client (only needed for Supabase backend)
 * @returns Success boolean
 */
export async function deleteProfileImage(
  imageUrl: string,
  supabaseClient?: any
): Promise<boolean> {
  if (CURRENT_STORAGE === 's3') {
    // Use S3 storage
    const { deleteProfileImage: s3Delete } = await import('./s3StorageUtils');
    return s3Delete(imageUrl);
  } else {
    // Use Supabase storage (current implementation)
    const { deleteProfileImage: supabaseDelete } = await import('./storageUtilsNew');
    if (!supabaseClient) {
      throw new Error('Supabase client required for Supabase storage');
    }
    return supabaseDelete(imageUrl, supabaseClient);
  }
}

/**
 * Get the current storage backend
 */
export function getCurrentStorageBackend(): StorageBackend {
  return CURRENT_STORAGE;
}

/**
 * Check if S3 is configured properly
 */
export function isS3Configured(): boolean {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET_NAME &&
    process.env.AWS_REGION
  );
}

/**
 * Migration helper to move files from Supabase to S3
 * This would be used for bulk migration if needed
 */
export async function migrateImageFromSupabaseToS3(
  supabaseUrl: string,
  userId: string,
  supabaseClient: any
): Promise<UploadResult> {
  try {
    // Download from Supabase
    const response = await fetch(supabaseUrl);
    if (!response.ok) {
      throw new Error('Failed to download from Supabase');
    }
    
    const blob = await response.blob();
    const file = new File([blob], `migrated-${Date.now()}.jpg`, { type: blob.type });
    
    // Upload to S3
    const { uploadProfileImage: s3Upload } = await import('./s3StorageUtils');
    const result = await s3Upload(file, userId);
    
    if (result.success) {
      // Optionally delete from Supabase after successful migration
      const { deleteProfileImage: supabaseDelete } = await import('./storageUtilsNew');
      await supabaseDelete(supabaseUrl, supabaseClient);
    }
    
    return result;
  } catch (error: any) {
    return { success: false, error: 'Migration failed: ' + error.message };
  }
}
