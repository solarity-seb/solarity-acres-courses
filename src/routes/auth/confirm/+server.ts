import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const { supabase } = locals;
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = url.searchParams.get('next') ?? '/private';

  console.log('Email confirmation attempt:', { token_hash: !!token_hash, type, next });

  if (!token_hash || !type) {
    console.error('Missing token_hash or type:', { token_hash: !!token_hash, type });
    throw redirect(303, '/auth/error?message=invalid-token');
  }

  try {
    // Handle different types of email confirmations
    let verificationResult;
    
    if (type === 'signup' || type === 'email') {
      // For email verification (signup confirmation)
      verificationResult = await supabase.auth.verifyOtp({
        token_hash,
        type: 'email'
      });
    } else if (type === 'recovery') {
      // For password reset
      verificationResult = await supabase.auth.verifyOtp({
        token_hash,
        type: 'recovery'
      });
    } else {
      // Fallback - try with the provided type
      verificationResult = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any
      });
    }

    if (verificationResult.error) {
      console.error('Verification error:', verificationResult.error);
      throw redirect(303, '/auth/error?message=verification-failed');
    }

    console.log('Email verification successful');
    
    // For password recovery, redirect to reset password form
    if (type === 'recovery') {
      throw redirect(303, '/auth/reset-password');
    }
    
    // For signup confirmation, redirect to private area
    throw redirect(303, next);
    
  } catch (err) {
    // If it's already a redirect, re-throw it
    if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
      throw err;
    }
    
    console.error('Unexpected error during email confirmation:', err);
    throw redirect(303, '/auth/error?message=unexpected-error');
  }
};
