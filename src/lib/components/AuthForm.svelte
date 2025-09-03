<!-- lib/components/AuthForm.svelte -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getAuthCallbackUrl, getResetPasswordUrl, getEmailConfirmUrl } from '$lib/utils/redirectUrls';

	export let supabase: any;
	export let mode: 'signin' | 'signup' | 'forgot' = 'signin';
	
	const dispatch = createEventDispatcher();
	
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let message = '';
	let errorMessage = '';

	// Placeholder management
	let emailFocused = false;
	let passwordFocused = false;
	let confirmPasswordFocused = false;

	async function handleEmailAuth() {
		loading = true;
		errorMessage = '';
		message = '';

		try {
			if (mode === 'signup') {
				if (password !== confirmPassword) {
					errorMessage = 'Passwords do not match';
					loading = false;
					return;
				}
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: getEmailConfirmUrl()
					}
				});
				if (error) {
					// Handle specific error types including rate limiting
					if (error.message.includes('rate limit') || error.message.includes('too many')) {
						errorMessage = 'Too many attempts. Please try again later.';
					} else if (error.message.includes('User already registered')) {
						errorMessage = 'An account with this email already exists. Try signing in instead.';
					} else {
						throw error;
					}
					loading = false;
					return;
				}
				message = 'Check your email for a confirmation link!';
			} else if (mode === 'signin') {
				try {
					const { error } = await supabase.auth.signInWithPassword({
						email,
						password,
					});
					if (error) {
						// Handle specific error types including rate limiting
						if (error.message.includes('rate limit') || error.message.includes('too many')) {
							errorMessage = 'Too many login attempts. Please try again later.';
						} else if (error.message.includes('Invalid login credentials')) {
							errorMessage = 'Invalid email or password. Please check your credentials.';
						} else {
							throw error;
						}
						loading = false;
						return;
					}
					
					console.log('Login successful, invalidating and redirecting...');
					await invalidateAll();
					
					// Small delay to ensure state is updated
					await new Promise(resolve => setTimeout(resolve, 100));
					
					const redirectTo = $page.url.searchParams.get('redirectTo') || '/private';
					goto(redirectTo);
				} catch (error) {
					console.error('Login error:', error);
					errorMessage = (error as any)?.message || 'Failed to log in. Please try again.';
				}
			} else if (mode === 'forgot') {
				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: getResetPasswordUrl(),
				});
				if (error) {
					if (error.message.includes('Invalid email')) {
						errorMessage = 'Please enter a valid email address.';
					} else if (error.message.includes('rate limit') || error.message.includes('too many')) {
						errorMessage = 'Too many reset requests. Please try again later.';
					} else {
						errorMessage = error.message || 'Failed to send reset password email. Please try again.';
					}
					loading = false;
					return;
				}
				message = 'Check your email for a password reset link!';
			}
		} catch (error: any) {
			if (error.message.includes('rate limit') || error.message.includes('too many')) {
				errorMessage = 'Too many attempts. Please wait before trying again.';
			} else {
				errorMessage = error.message;
			}
		} finally {
			loading = false;
		}
	}

	async function handleSocialAuth(provider: 'google' | 'facebook' | 'azure') {
		loading = true;
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: getAuthCallbackUrl()
				}
			});
			if (error) throw error;
		} catch (error: any) {
			errorMessage = error.message;
			loading = false;
		}
	}

	function switchMode(newMode: 'signin' | 'signup' | 'forgot') {
		mode = newMode;
		errorMessage = '';
		message = '';
		dispatch('modeChange', newMode);
	}
</script>

<div class="auth-form">
	{#if mode === 'signin'}
		<h2>Sign In</h2>
		<p class="auth-subtitle">Welcome back! Sign in to your account.</p>
	{:else if mode === 'signup'}
		<h2>Create Account</h2>
		<p class="auth-subtitle">Join our community of growers.</p>
	{:else if mode === 'forgot'}
		<h2>Reset Password</h2>
		<p class="auth-subtitle">Enter your email to reset your password.</p>
	{/if}

	{#if message}
		<div class="alert alert-success">{message}</div>
	{/if}

	{#if errorMessage}
		<div class="alert alert-error">{errorMessage}</div>
	{/if}

	<form on:submit|preventDefault={handleEmailAuth}>
		<!-- Email Input -->
		<div class="form-group">
			<input
				id="email"
				type="email"
				bind:value={email}
				required
				disabled={loading}
				placeholder=" "
				on:focus={() => emailFocused = true}
				on:blur={() => emailFocused = false}
			/>
			<label for="email">Email</label>
		</div>

		{#if mode !== 'forgot'}
			<!-- Password Input -->
			<div class="form-group">
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					disabled={loading}
					placeholder=" "
					minlength="6"
					on:focus={() => passwordFocused = true}
					on:blur={() => passwordFocused = false}
				/>
				<label for="password">Password</label>
			</div>
		{/if}

		{#if mode === 'signup'}
			<!-- Confirm Password Input -->
			<div class="form-group">
				<input
					id="confirmPassword"
					type="password"
					bind:value={confirmPassword}
					required
					disabled={loading}
					placeholder=" "
					minlength="6"
					on:focus={() => confirmPasswordFocused = true}
					on:blur={() => confirmPasswordFocused = false}
				/>
				<label for="confirmPassword">Confirm Password</label>
			</div>
		{/if}

		<button type="submit" class="btn btn-primary btn-full-width" disabled={loading}>
			{#if loading}
				<span class="loading-spinner"></span>
			{/if}
			{mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
		</button>
	</form>

	{#if mode !== 'forgot'}
		<div class="divider">
			<span>Or continue with</span>
		</div>

		<div class="social-buttons">
			<button
				type="button"
				class="btn btn-social btn-google"
				on:click={() => handleSocialAuth('google')}
				disabled={loading}
			>
				<svg class="social-icon" viewBox="0 0 24 24">
					<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
					<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
					<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
					<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
				</svg>
				Google
			</button>

			<button
				type="button"
				class="btn btn-social btn-facebook"
				on:click={() => handleSocialAuth('facebook')}
				disabled={loading}
			>
				<svg class="social-icon" viewBox="0 0 24 24">
					<path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
				</svg>
				Facebook
			</button>

			<button
				type="button"
				class="btn btn-social btn-microsoft"
				on:click={() => handleSocialAuth('azure')}
				disabled={loading}
			>
				<svg class="social-icon" viewBox="0 0 24 24">
					<path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
					<path fill="#0078D4" d="M12.623 0H24v11.372H12.623z"/>
					<path fill="#00BCF2" d="M0 12.628h11.377V24H0z"/>
					<path fill="#40E0D0" d="M12.623 12.628H24V24H12.623z"/>
				</svg>
				Microsoft
			</button>
		</div>
	{/if}

	<div class="auth-links">
		{#if mode === 'signin'}
			<p>
				Don't have an account? 
				<button type="button" class="link-button" on:click={() => switchMode('signup')}>Sign up</button>
			</p>
			<p>
				<button type="button" class="link-button" on:click={() => switchMode('forgot')}>Forgot password?</button>
			</p>
		{:else if mode === 'signup'}
			<p>
				Already have an account? 
				<button type="button" class="link-button" on:click={() => switchMode('signin')}>Sign in</button>
			</p>
		{:else if mode === 'forgot'}
			<p>
				Remember your password? 
				<button type="button" class="link-button" on:click={() => switchMode('signin')}>Sign in</button>
			</p>
		{/if}
	</div>
</div>

<style>
	.auth-form {
		max-width: 400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.auth-form h2 {
		text-align: center;
		margin-bottom: 0.5rem;
		font-size: 2rem;
	}

	.auth-subtitle {
		text-align: center;
		color: var(--text-light);
		margin-bottom: 2rem;
	}

	.alert {
		padding: 1rem;
		border-radius: var(--btn-border-radius);
		margin-bottom: 1rem;
		text-align: center;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	.form-group {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid var(--text-color);
		border-radius: var(--btn-border-radius);
		font-size: 1rem;
		transition: border-color 0.3s;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-group label {
		position: absolute;
		top: 50%;
		left: 0.75rem;
		transform: translateY(-50%);
		background: var(--bg);
		padding: 0 0.25rem;
		color: var(--text-light);
		font-size: 1rem;
		pointer-events: none;
		transition: all 0.2s;
	}

	.form-group input:focus + label,
	.form-group input:not(:placeholder-shown) + label {
		top: -0.5rem;
		font-size: 0.85rem;
		color: var(--accent);
	}

	.divider {
		text-align: center;
		margin: 2rem 0;
		position: relative;
	}

	.divider::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background-color: var(--text-light);
	}

	.divider span {
		background-color: var(--bg);
		padding: 0 1rem;
		color: var(--text-light);
		font-size: 0.9rem;
	}

	.social-buttons {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 2rem;
	}

	.btn-social {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--text-color);
		background-color: var(--bg);
		color: var(--text-color);
		text-decoration: none;
		transition: all 0.3s;
	}

	.btn-social:hover {
		background-color: var(--text-color);
		color: var(--bg);
	}

	.social-icon {
		width: 20px;
		height: 20px;
	}

	.auth-links {
		text-align: center;
	}

	.auth-links p {
		margin-bottom: 0.5rem;
	}

	.link-button {
		background: none;
		border: none;
		color: var(--accent);
		cursor: pointer;
		text-decoration: underline;
		font-size: inherit;
		padding: 0;
	}

	.link-button:hover {
		color: var(--accent-2);
	}

	.loading-spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top: 2px solid currentColor;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-right: 0.5rem;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.alert {
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: var(--btn-border-radius);
		font-size: 0.9rem;
	}

	.alert-success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}

	.alert-error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}

	@media (max-width: 600px) {
		.auth-form {
			padding: 1rem;
		}
		
		.social-buttons {
			flex-direction: column;
		}
	}
</style>
