<script lang="ts">
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import { getResetPasswordUrl } from '$lib/utils/redirectUrls';

  let email = '';
  let loading = false;
  let message = '';
  let errorMessage = '';

  async function handleForgotPassword() {
    loading = true;
    message = '';
    errorMessage = '';

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getResetPasswordUrl(),
      });

      if (error) {
        throw error;
      }

      message = 'Check your email for a password reset link!';
    } catch (error: any) {
      errorMessage = error.message || 'Failed to send reset password email. Please try again.';
    } finally {
      loading = false;
    }
  }
</script>

<div class="forgot-password-form">
  <h1>Forgot Password</h1>
  <p>Enter your email address to reset your password.</p>

  {#if message}
    <div class="alert alert-success">{message}</div>
  {/if}

  {#if errorMessage}
    <div class="alert alert-error">{errorMessage}</div>
  {/if}

  <form on:submit|preventDefault={handleForgotPassword}>
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        required
        placeholder="Enter your email"
      />
    </div>

    <button type="submit" class="btn" disabled={loading}>
      {#if loading}
        <span class="loading-spinner"></span>
      {/if}
      Send Reset Link
    </button>
  </form>
</div>

<style>
  .forgot-password-form {
    max-width: 400px;
    margin: 0 auto;
    text-align: center;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .alert {
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 4px;
  }

  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }

  .alert-error {
    background-color: #f8d7da;
    color: #721c24;
  }

  .btn {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
