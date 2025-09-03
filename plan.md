# FLARUM SSO & PROFILE IMAGES INTEGRATION PLAN

## CURRENT SYSTEM ANALYSIS

### Existing Infrastructure
- **Framework**: SvelteKit with TypeScript
- **Authentication**: Supabase Auth (client-side due to server cookie issues)
- **Current Setup**: 
  - Users authenticate through `/signin` and `/signup` pages
  - Profile management in `/private/profile`
  - Community link in navigation points to external Flarum: `https://community.solarity.farm/`
  - Environment variables already configured for Flarum SSO

### Current Authentication Flow
1. Users register/login via Supabase Auth
2. Session management handled client-side
3. Profile data stored in `user.user_metadata`
4. Community link redirects to external Flarum (no SSO)

---

## IMPLEMENTATION REQUIREMENTS

### 1. FLARUM SSO INTEGRATION
**Goal**: Seamless authentication between SvelteKit app and Flarum community

### 2. BIDIRECTIONAL AUTHENTICATION
- Flarum → SvelteKit: Users clicking login in Flarum are redirected to SvelteKit login
- SvelteKit → Flarum: Logged-in users clicking community are auto-authenticated in Flarum

### 3. PROFILE PICTURE STORAGE
**Goal**: Store profile images in Supabase buckets instead of external URLs

### 4. JWT INTEGRATION
**Goal**: Use Supabase JWT for secure SSO communication

---

## DETAILED IMPLEMENTATION PLAN

## PHASE 1: SUPABASE STORAGE FOR PROFILE IMAGES

### A. Storage Setup
```sql
-- Create storage bucket
CREATE BUCKET profile-images;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can upload their own profile images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public read access for profile images" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-images');
```

### B. Code Changes for Profile Images
**Files to Create/Modify:**

1. **New File: `src/lib/utils/storageUtils.ts`**
```typescript
import { supabase } from '$lib/supabaseClient';

export async function uploadProfileImage(file: File, userId: string) {
  // File validation, upload, and URL generation
}

export async function deleteProfileImage(imageUrl: string) {
  // Remove old profile images
}
```

2. **Update: `src/lib/components/ClientUserProfile.svelte`**
- Add file upload functionality
- Integrate with storage utilities
- Add upload progress and error handling

---

## PHASE 2: JWT & SSO INFRASTRUCTURE

### A. Environment Variables
**Update `.env`:**
```bash
# Existing
FLARUM_SSO_SECRET=secure-jwt-secret-key-for-sso-2024-hiloh-system
FLARUM_BASE_URL=https://community.solarity.farm

# New additions
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=secure-jwt-secret-for-flarum-sso-2024
SVELTEKIT_BASE_URL=http://localhost:5174  # or production URL
```

### B. JWT Utilities
**New File: `src/lib/utils/jwtUtils.ts`**
```typescript
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export interface FlarumSSOPayload {
  userId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  groups?: string[];
  iat: number;
  exp: number;
}

export function generateFlarumJWT(user: any): string {
  // Generate JWT for Flarum SSO
}

export function verifyFlarumJWT(token: string): FlarumSSOPayload | null {
  // Verify JWT from Flarum
}
```

---

## PHASE 3: FLARUM SSO ENDPOINTS

### A. Flarum → SvelteKit Authentication
**New File: `src/routes/api/auth/flarum-login/+server.ts`**
```typescript
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, cookies }) => {
  // Handle incoming requests from Flarum
  // Redirect to login page with return URL
  const returnUrl = url.searchParams.get('return_url');
  const redirectTo = returnUrl ? `?redirectTo=${encodeURIComponent(returnUrl)}` : '';
  
  throw redirect(303, `/signin${redirectTo}`);
};
```

### B. SvelteKit → Flarum Authentication  
**New File: `src/routes/api/auth/flarum-sso/+server.ts`**
```typescript
import { json, redirect } from '@sveltejs/kit';
import { generateFlarumJWT } from '$lib/utils/jwtUtils';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase }, url }) => {
  // Get current user session
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (!user) {
    throw redirect(303, '/signin?redirectTo=/community');
  }

  // Generate JWT for Flarum
  const token = generateFlarumJWT(user);
  
  // Redirect to Flarum with JWT
  const flarumUrl = new URL('/auth/sso', FLARUM_BASE_URL);
  flarumUrl.searchParams.set('token', token);
  flarumUrl.searchParams.set('return_url', url.searchParams.get('return_url') || '/');
  
  throw redirect(303, flarumUrl.toString());
};
```

### C. User Creation/Sync Endpoint
**New File: `src/routes/api/auth/sync-flarum-user/+server.ts`**
```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
  // Create or update Flarum user account
  // This endpoint is called by Flarum when it receives SSO token
  
  const { userId, username, email, avatarUrl } = await request.json();
  
  // Verify JWT signature
  // Create/update user in Flarum database
  // Return success/failure response
  
  return json({ success: true });
};
```

---

## PHASE 4: NAVIGATION & UI UPDATES

### A. Update Community Link
**Update: `src/lib/data/navLinks.js`**
```javascript
export const navLinks = [
  // Change from external link to SSO endpoint
  { name: 'Community', href: '/api/auth/flarum-sso', layout: 'both', location: 'both', cta: false },
  // ... other links
];
```

### B. Update Authentication Forms
**Update: `src/lib/components/AuthForm.svelte`**
```typescript
// Add handling for Flarum return URLs
async function handleEmailAuth() {
  // ... existing login logic
  
  if (mode === 'signin' && !error) {
    const flarumReturnUrl = $page.url.searchParams.get('flarum_return');
    if (flarumReturnUrl) {
      // Redirect to Flarum SSO endpoint after successful login
      goto(`/api/auth/flarum-sso?return_url=${encodeURIComponent(flarumReturnUrl)}`);
      return;
    }
    // ... existing redirect logic
  }
}
```

---

## PHASE 5: FLARUM CONFIGURATION

### A. Required Flarum Extensions
1. **FoF SSO Extension** or **Custom SSO Extension**
2. **JWT Authentication Extension**

### B. Flarum SSO Configuration
**In Flarum Admin Panel:**
```php
// config.php additions
'sso' => [
    'enabled' => true,
    'provider_url' => 'https://your-sveltekit-app.com/api/auth/flarum-sso',
    'login_url' => 'https://your-sveltekit-app.com/api/auth/flarum-login',
    'jwt_secret' => 'secure-jwt-secret-for-flarum-sso-2024',
    'user_sync_url' => 'https://your-sveltekit-app.com/api/auth/sync-flarum-user',
]
```

### C. Flarum Database Tables
```sql
-- Extend users table for SSO
ALTER TABLE users ADD COLUMN sso_id VARCHAR(255);
ALTER TABLE users ADD COLUMN sso_provider VARCHAR(50) DEFAULT 'sveltekit';
```

---

## PHASE 6: SECURITY & ERROR HANDLING

### A. JWT Security
- **Token Expiration**: 1 hour for SSO tokens
- **Secret Rotation**: Ability to rotate JWT secrets
- **Signature Verification**: Always verify JWT signatures
- **Scope Limitation**: Limit JWT payload to necessary data only

### B. Error Handling
**New File: `src/routes/auth/sso-error/+page.svelte`**
```svelte
<!-- Handle SSO errors gracefully -->
<script>
  import { page } from '$app/stores';
  
  const errorType = $page.url.searchParams.get('error');
  const errorMessage = $page.url.searchParams.get('message');
</script>

<div class="error-container">
  <h2>Authentication Error</h2>
  <p>{errorMessage || 'An error occurred during authentication'}</p>
  <a href="/signin">Try Again</a>
</div>
```

### C. Rate Limiting
```typescript
// Implement rate limiting for SSO endpoints
const rateLimiter = new Map();

export function checkRateLimit(identifier: string): boolean {
  // Implement sliding window rate limiting
  // Max 10 SSO attempts per minute per user
}
```

---

## PHASE 7: USER EXPERIENCE FLOWS

### A. New User Journey
1. **Flarum Discovery**: User visits Flarum community
2. **Login Redirect**: Clicks login → redirected to SvelteKit `/signin`
3. **Account Creation**: Creates account in SvelteKit
4. **Automatic Flarum Account**: Flarum account created automatically via SSO
5. **Seamless Access**: User lands in Flarum with active session

### B. Existing User Journey  
1. **SvelteKit Login**: User logs into SvelteKit app
2. **Community Access**: Clicks "Community" in navigation
3. **SSO Authentication**: Automatically authenticated in Flarum
4. **Profile Sync**: Profile data (including avatar) synced to Flarum

### C. Profile Picture Sync
1. **Upload in SvelteKit**: User uploads profile image
2. **Supabase Storage**: Image stored in Supabase bucket
3. **URL Generation**: Public URL generated
4. **Flarum Sync**: Profile image URL synced to Flarum profile

---

## IMPLEMENTATION ORDER & TIMELINE

### Week 1: Foundation
- [ ] Set up Supabase storage bucket and policies
- [ ] Create storage utility functions
- [ ] Update profile image upload in ClientUserProfile.svelte
- [ ] Test profile image storage and display

### Week 2: JWT Infrastructure
- [ ] Install JWT dependencies (`npm install jsonwebtoken @types/jsonwebtoken`)
- [ ] Create JWT utility functions
- [ ] Set up environment variables
- [ ] Create basic SSO endpoint structure

### Week 3: SSO Implementation
- [ ] Implement Flarum → SvelteKit authentication flow
- [ ] Implement SvelteKit → Flarum authentication flow
- [ ] Create user sync endpoints
- [ ] Update navigation links

### Week 4: Flarum Integration
- [ ] Configure Flarum SSO extension
- [ ] Set up Flarum database modifications
- [ ] Test bidirectional authentication
- [ ] Implement error handling

### Week 5: Testing & Refinement
- [ ] End-to-end testing of all flows
- [ ] Security testing and validation
- [ ] Performance optimization
- [ ] Documentation and deployment

---

## DEPENDENCIES & PACKAGES

### New NPM Packages Required
```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.5"
  }
}
```

### Flarum Extensions Required
- FoF SSO or custom SSO extension
- JWT authentication support

---

## SECURITY CONSIDERATIONS

### A. Data Protection
- **JWT Secrets**: Store securely, rotate regularly
- **User Data**: Minimal data transfer between systems
- **HTTPS Only**: All SSO communications over HTTPS
- **CORS Configuration**: Proper CORS setup for API endpoints

### B. Attack Prevention
- **CSRF Protection**: Implement CSRF tokens for state changes
- **Rate Limiting**: Prevent brute force attacks on SSO endpoints
- **Input Validation**: Validate all incoming data
- **Session Management**: Proper session timeout and cleanup

### C. Privacy Compliance
- **Data Minimization**: Only sync necessary user data
- **Consent Management**: User consent for data sync between platforms
- **Data Retention**: Clear policies for data storage and deletion

---

## TESTING STRATEGY

### A. Unit Tests
- JWT generation and verification
- Storage utility functions
- API endpoint responses

### B. Integration Tests
- Full SSO flow testing
- Profile image upload and sync
- Error handling scenarios

### C. User Acceptance Tests
- New user registration flow
- Existing user community access
- Profile picture updates
- Error recovery

---

## MONITORING & MAINTENANCE

### A. Logging
- SSO authentication attempts
- Profile image uploads
- Error rates and types
- Performance metrics

### B. Alerts
- High error rates in SSO flow
- Failed image uploads
- JWT token expiration issues
- Flarum sync failures

### C. Regular Maintenance
- JWT secret rotation (quarterly)
- Storage cleanup (monthly)
- Security audit (bi-annually)
- Performance review (monthly)

---

## ROLLBACK PLAN

### A. Quick Rollback
- Disable SSO endpoints
- Revert navigation links to external Flarum
- Maintain existing profile image functionality

### B. Data Recovery
- Profile images remain in Supabase storage
- User accounts unaffected
- Flarum operates independently if needed

---

## SUCCESS CRITERIA

### A. Functional Requirements
- [ ] Users can authenticate from Flarum to SvelteKit
- [ ] Users can access Flarum from SvelteKit with auto-login
- [ ] Profile images stored in Supabase buckets
- [ ] Automatic Flarum account creation for new users
- [ ] Profile data sync between platforms

### B. Performance Requirements
- [ ] SSO authentication completes within 3 seconds
- [ ] Profile image uploads complete within 10 seconds
- [ ] No impact on existing authentication flows
- [ ] 99.9% uptime for SSO endpoints

### C. Security Requirements
- [ ] All communications encrypted (HTTPS)
- [ ] JWT tokens properly signed and verified
- [ ] User data access properly restricted
- [ ] No sensitive data logged or exposed

---

## NOTES & CONSIDERATIONS

1. **Backward Compatibility**: Existing users must continue to work without interruption
2. **Mobile Responsiveness**: All new UI components must work on mobile devices
3. **Accessibility**: SSO flows must be accessible to users with disabilities
4. **SEO Impact**: Community links should not negatively impact SEO
5. **Cache Strategy**: Consider caching strategies for profile images and JWT tokens

This plan provides a comprehensive roadmap for implementing seamless Flarum SSO integration with Supabase-backed profile image storage while maintaining security and user experience standards.
