# AWS CLI setup script for S3 bucket creation
# Run these commands in your terminal after installing AWS CLI

# 1. Configure AWS CLI with your credentials
aws configure set aws_access_key_id YOUR_ACCESS_KEY_HERE
aws configure set aws_secret_access_key YOUR_SECRET_KEY_HERE
aws configure set default.region us-east-1

# 2. Create the S3 bucket
aws s3 mb s3://solarity-profile-images --region us-east-1

# 3. Configure bucket for public read access
aws s3api put-bucket-acl --bucket solarity-profile-images --acl public-read

# 4. Set CORS policy
aws s3api put-bucket-cors --bucket solarity-profile-images --cors-configuration file://cors-config.json

# 5. Set bucket policy for public read
aws s3api put-bucket-policy --bucket solarity-profile-images --policy file://bucket-policy.json

echo "✅ S3 bucket setup complete!"
