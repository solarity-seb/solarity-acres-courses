// Test script to verify S3 configuration
import { uploadProfileImage, validateImageFile } from './s3StorageUtils.js';

async function testS3Configuration() {
  console.log('🧪 Testing S3 Configuration...');
  
  // Check environment variables
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_REGION',
    'S3_BUCKET_NAME'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    return;
  }
  
  console.log('✅ All environment variables are set');
  console.log('📍 Region:', process.env.AWS_REGION);
  console.log('🪣 Bucket:', process.env.S3_BUCKET_NAME);
  
  // Test file validation
  console.log('\n🔍 Testing file validation...');
  const validationTest = validateImageFile(new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
  console.log('✅ File validation working:', validationTest.valid);
  
  console.log('\n✨ S3 configuration test complete!');
  console.log('📋 Next steps:');
  console.log('1. Add your actual AWS credentials to .env');
  console.log('2. Test upload with a real image file');
  console.log('3. Switch to S3 in universalStorage.ts when ready');
}

// Run the test
testS3Configuration().catch(console.error);
