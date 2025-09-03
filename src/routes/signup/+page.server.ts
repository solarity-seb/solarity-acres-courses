import { redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { dev } from '$app/environment'
import { PUBLIC_BASE_URL } from '$env/static/public'

// Production domain configuration
const PRODUCTION_DOMAIN = PUBLIC_BASE_URL || 'https://solarity.farm'

function getBaseUrl(origin: string): string {
  // In development, use the origin from the request
  // In production, use the production domain
  return dev ? origin : PRODUCTION_DOMAIN
}

// Keep server actions for fallback or non-JS scenarios
export const actions: Actions = {
  signup: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    try {
      const origin = new URL(request.url).origin
      const baseUrl = getBaseUrl(origin)
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${baseUrl}/auth/confirm`
        }
      })
      
      if (error) {
        throw error
      }
      
      return { success: 'Account created successfully! Please check your email to verify your account.' }
    } catch (error: any) {
      return { error: error.message || 'Failed to create account. Please try again.' }
    }
  },
  
  login: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      return { error: error.message }
    }
    
    throw redirect(303, '/private')
  },

  forgotPassword: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string

    if (!email) {
      return { error: 'Email is required' }
    }

    try {
      const origin = new URL(request.url).origin
      const baseUrl = getBaseUrl(origin)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${baseUrl}/auth/reset-password`
      })
      
      if (error) {
        throw error
      }

      return { success: 'Check your email for a password reset link!' }
    } catch (error: any) {
      if (error.message.includes('Invalid email')) {
        return { error: 'Please enter a valid email address.' }
      } else if (error.message.includes('rate limit')) {
        return { error: 'Too many requests. Please try again later.' }
      } else {
        return { error: error.message || 'Failed to send reset password email. Please try again.' }
      }
    }
  },

  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut()
    throw redirect(303, '/')
  }
}