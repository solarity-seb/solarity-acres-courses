import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
  rateLimited?: boolean;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Initialize S3 client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return s3Client;
}

/**
 * Upload profile image to AWS S3
 * @param file - File object to upload
 * @param userId - User ID for folder organization
 * @param onProgress - Optional progress callback
 * @returns Upload result with URL or error
 */
export async function uploadProfileImage(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> {
  try {
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

    // Create unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}/profile-${timestamp}-${randomStr}.${fileExt}`;

    // Get S3 client and bucket name
    const s3 = getS3Client();
    const bucketName = process.env.S3_BUCKET_NAME || '';

    if (!bucketName) {
      return { success: false, error: 'S3 bucket name not configured' };
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
      CacheControl: 'public, max-age=3600',
      Metadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3.send(uploadCommand);

    // Generate public URL
    const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`;

    return {
      success: true,
      url: publicUrl,
      path: fileName
    };

  } catch (error: any) {
    console.error('S3 Upload failed:', error);
    
    // Handle specific AWS errors
    if (error.name === 'InvalidAccessKeyId') {
      return { success: false, error: 'Invalid AWS credentials' };
    }
    
    if (error.name === 'NoSuchBucket') {
      return { success: false, error: 'S3 bucket not found' };
    }
    
    if (error.name === 'AccessDenied') {
      return { success: false, error: 'Access denied to S3 bucket' };
    }

    return { success: false, error: 'Upload failed: ' + (error.message || 'Unknown error') };
  }
}

/**
 * Delete profile image from AWS S3
 * @param imageUrl - URL or path of the image to delete
 * @returns True if successful, false otherwise
 */
export async function deleteProfileImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return true;

    // Extract file path from URL
    let filePath: string;
    const bucketName = process.env.S3_BUCKET_NAME || '';
    
    if (imageUrl.includes(`${bucketName}.s3.`)) {
      // Extract path from full S3 URL
      const urlParts = imageUrl.split(`${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/`);
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

    const s3 = getS3Client();

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filePath,
    });

    await s3.send(deleteCommand);

    console.log('Successfully deleted file:', filePath);
    return true;

  } catch (error: any) {
    console.error('Failed to delete image:', error);
    
    // Handle specific AWS errors
    if (error.name === 'NoSuchKey') {
      console.info('File not found, considering as successfully deleted');
      return true;
    }
    
    return false;
  }
}

/**
 * Delete all existing profile images for a user
 * @param userId - User ID
 * @returns True if successful
 */
export async function deleteExistingProfileImages(userId: string): Promise<boolean> {
  try {
    const s3 = getS3Client();
    const bucketName = process.env.S3_BUCKET_NAME || '';

    // List all objects with userId prefix
    const { ListObjectsV2Command } = await import('@aws-sdk/client-s3');
    
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${userId}/profile-`,
    });

    const listResponse = await s3.send(listCommand);

    if (listResponse.Contents && listResponse.Contents.length > 0) {
      // Delete all found files
      for (const object of listResponse.Contents) {
        if (object.Key) {
          await deleteProfileImage(object.Key);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Failed to delete existing profile images:', error);
    return false;
  }
}

/**
 * Generate a presigned URL for secure uploads (alternative method)
 * @param userId - User ID
 * @param fileExtension - File extension
 * @returns Presigned URL for upload
 */
export async function generatePresignedUploadUrl(userId: string, fileExtension: string): Promise<string | null> {
  try {
    const s3 = getS3Client();
    const bucketName = process.env.S3_BUCKET_NAME || '';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `${userId}/profile-${timestamp}-${randomStr}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
    return signedUrl;
  } catch (error) {
    console.error('Failed to generate presigned URL:', error);
    return null;
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

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check allowed types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
  }

  return { valid: true };
}
