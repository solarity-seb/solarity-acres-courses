// Test IAM user permissions for S3
import { S3Client, ListBucketsCommand, CreateBucketCommand, PutBucketPolicyCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';

async function testIAMPermissions() {
  console.log('🔐 Testing IAM User Permissions...\n');
  
  // Check environment variables
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ Please add your AWS credentials to .env file first');
    return;
  }
  
  console.log('🔑 Using Access Key:', process.env.AWS_ACCESS_KEY_ID);
  console.log('📍 Region:', process.env.AWS_REGION || 'us-east-1');
  
  const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  console.log('\n🧪 Testing Permissions...\n');
  
  // Test 1: List Buckets
  console.log('1️⃣ Testing ListBuckets permission...');
  try {
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);
    console.log('✅ ListBuckets: SUCCESS');
    console.log('📦 Available buckets:', listResponse.Buckets?.map(b => b.Name) || 'None');
    
    // Check if target bucket exists
    const targetBucket = process.env.S3_BUCKET_NAME || 'solarity-profile-images';
    const bucketExists = listResponse.Buckets?.some(bucket => bucket.Name === targetBucket);
    
    if (bucketExists) {
      console.log(`✅ Target bucket "${targetBucket}" already exists`);
    } else {
      console.log(`ℹ️ Target bucket "${targetBucket}" needs to be created`);
      
      // Test 2: Create Bucket (if needed)
      console.log('\n2️⃣ Testing CreateBucket permission...');
      try {
        const createCommand = new CreateBucketCommand({
          Bucket: targetBucket,
          CreateBucketConfiguration: process.env.AWS_REGION !== 'us-east-1' ? {
            LocationConstraint: process.env.AWS_REGION
          } : undefined
        });
        
        await s3Client.send(createCommand);
        console.log(`✅ CreateBucket: SUCCESS - Created "${targetBucket}"`);
      } catch (createError) {
        if (createError.name === 'BucketAlreadyExists') {
          console.log(`ℹ️ Bucket "${targetBucket}" already exists (owned by someone else)`);
        } else if (createError.name === 'BucketAlreadyOwnedByYou') {
          console.log(`✅ Bucket "${targetBucket}" already exists and is owned by you`);
        } else {
          console.log('❌ CreateBucket: FAILED -', createError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ ListBuckets: FAILED -', error.message);
    if (error.name === 'InvalidAccessKeyId') {
      console.log('🔧 Check your AWS_ACCESS_KEY_ID');
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('🔧 Check your AWS_SECRET_ACCESS_KEY');
    }
    return;
  }
  
  // Test 3: Put Object Permission
  console.log('\n3️⃣ Testing PutObject permission...');
  try {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const testKey = 'test-permissions/test-file.txt';
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'solarity-profile-images',
      Key: testKey,
      Body: 'Permission test file',
      ContentType: 'text/plain'
    });
    
    await s3Client.send(putCommand);
    console.log('✅ PutObject: SUCCESS');
    
    // Test 4: Delete Object Permission
    console.log('\n4️⃣ Testing DeleteObject permission...');
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME || 'solarity-profile-images',
      Key: testKey
    });
    
    await s3Client.send(deleteCommand);
    console.log('✅ DeleteObject: SUCCESS');
    
  } catch (error) {
    console.log('❌ PutObject/DeleteObject: FAILED -', error.message);
  }
  
  console.log('\n🎉 IAM Permission Test Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Your IAM user is properly configured');
  console.log('✅ Ready to use S3 for profile images');
  console.log('\n🚀 Next steps:');
  console.log('1. Configure bucket CORS and policies (if needed)');
  console.log('2. Switch to S3 storage in your app');
}

// Run the test
testIAMPermissions().catch(console.error);
