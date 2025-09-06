// Complete S3 setup test
import { S3Client, ListBucketsCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

async function testCompleteS3Setup() {
  console.log('🧪 Testing Complete S3 Setup...\n');
  
  // Check environment variables
  console.log('1️⃣ Checking Environment Variables...');
  const requiredEnvs = {
    'AWS_ACCESS_KEY_ID': process.env.AWS_ACCESS_KEY_ID,
    'AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY,
    'AWS_REGION': process.env.AWS_REGION,
    'S3_BUCKET_NAME': process.env.S3_BUCKET_NAME
  };
  
  const missing = Object.entries(requiredEnvs)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    return;
  }
  
  console.log('✅ All environment variables present');
  console.log(`📍 Region: ${process.env.AWS_REGION}`);
  console.log(`🪣 Bucket: ${process.env.S3_BUCKET_NAME}\n`);
  
  // Initialize S3 client
  console.log('2️⃣ Testing AWS Connection...');
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  
  try {
    // Test 1: List buckets (verify credentials)
    const listCommand = new ListBucketsCommand({});
    const listResponse = await s3Client.send(listCommand);
    console.log('✅ AWS credentials valid');
    
    const bucketExists = listResponse.Buckets?.some(
      bucket => bucket.Name === process.env.S3_BUCKET_NAME
    );
    
    if (bucketExists) {
      console.log('✅ Target bucket exists');
    } else {
      console.log('❌ Target bucket not found');
      console.log('Available buckets:', listResponse.Buckets?.map(b => b.Name));
      return;
    }
    
  } catch (error) {
    console.error('❌ AWS connection failed:', error.message);
    return;
  }
  
  // Test 2: Upload test file
  console.log('\n3️⃣ Testing File Upload...');
  try {
    const testContent = 'Hello from Solarity Acres Courses!';
    const testKey = 'test-user/test-upload.txt';
    
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    await s3Client.send(uploadCommand);
    console.log('✅ File upload successful');
    
    // Test 3: Generate public URL
    const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${testKey}`;
    console.log('📡 Public URL:', publicUrl);
    
    // Test 4: Test public access
    console.log('\n4️⃣ Testing Public Access...');
    try {
      const response = await fetch(publicUrl);
      if (response.ok) {
        const content = await response.text();
        console.log('✅ Public access working');
        console.log('📄 Retrieved content:', content);
      } else {
        console.log('❌ Public access failed:', response.status, response.statusText);
        console.log('🔧 Check bucket policy and CORS configuration');
      }
    } catch (fetchError) {
      console.log('❌ Public access test failed:', fetchError.message);
    }
    
    // Cleanup test file
    console.log('\n5️⃣ Cleaning up test file...');
    const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: testKey,
    });
    
    await s3Client.send(deleteCommand);
    console.log('✅ Test file cleaned up');
    
  } catch (uploadError) {
    console.error('❌ Upload test failed:', uploadError.message);
    
    if (uploadError.name === 'AccessDenied') {
      console.log('🔧 Check IAM permissions for PutObject action');
    }
    return;
  }
  
  console.log('\n🎉 S3 Setup Test Complete!');
  console.log('✅ Your S3 bucket is ready for profile images');
  console.log('\n📋 Next steps:');
  console.log('1. Switch CURRENT_STORAGE to "s3" in universalStorage.ts');
  console.log('2. Test profile image upload in your app');
  console.log('3. Add environment variables to Vercel');
}

// Run the test
testCompleteS3Setup().catch(console.error);
