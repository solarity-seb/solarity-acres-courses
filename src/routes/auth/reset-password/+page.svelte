<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import SEO from '$lib/components/SEO.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';
	
	export let data;
	
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let message = '';
	let errorMessage = '';
	
	// Placeholder management
	let passwordFocused = false;
	let confirmPasswordFocused = false;
	
	async function handlePasswordReset() {
		if (password !== confirmPassword) {
			errorMessage = 'Passwords do not match';
			return;
		}
		
		if (password.length < 6) {
			errorMessage = 'Password must be at least 6 characters';
			return;
		}
		
		loading = true;
		errorMessage = '';
		
		try {
			const { error } = await data.supabase.auth.updateUser({
				password: password
			});
			
			if (error) throw error;
			
			message = 'Password updated successfully! Redirecting...';
			setTimeout(() => goto('/private'), 2000);
		} catch (error: any) {
			errorMessage = error.message;
		} finally {
			loading = false;
		}
	}
</script>

<SEO
	title="Reset Password"
	description="Set your new password."
	url="/auth/reset-password"
	noIndex={true}
/>

<PageTitle
	subheading="Enter your new password below."
	alignment="center"
	bg="bg1"
>
	<svelte:fragment slot="top">
		<p class="eyebrow">Almost Done!</p>
		<h1>Reset Your <em>Password</em></h1>
	</svelte:fragment>
</PageTitle>

<section>
	<div class="flex-grid">
		<div class="col-12">
			<div class="card card-1 u-card-padding">
				<div class="auth-form" style="max-width: 400px; margin: 0 auto;">
					{#if message}
						<div class="alert alert-success">{message}</div>
					{/if}

					{#if errorMessage}
						<div class="alert alert-error">{errorMessage}</div>
					{/if}

					<form on:submit|preventDefault={handlePasswordReset}>
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
							<label for="password">New Password</label>
						</div>

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
							<label for="confirmPassword">Confirm New Password</label>
						</div>

						<button type="submit" class="btn btn-primary btn-full-width" disabled={loading}>
							{#if loading}
								<span class="loading-spinner"></span>
							{/if}
							Update Password
						</button>
					</form>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
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
		margin-bottom: 1.5rem;
		position: relative;
	}

	.form-group input {
		width: 100%;
		padding: 1rem 0.75rem 0.5rem 0.75rem;
		border: 2px solid var(--text-color);
		border-radius: var(--btn-border-radius);
		font-size: 1rem;
		transition: border-color 0.3s;
		background: var(--bg-color);
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
		left: 0.75rem;
		top: 0.3rem;
		font-size: 0.8rem;
		color: var(--text-light);
		pointer-events: none;
		transition: all 0.3s ease;
		font-weight: 500;
	}

	.form-group input:focus + label,
	.form-group input:not(:placeholder-shown) + label {
		color: var(--accent);
		font-size: 0.75rem;
		top: 0.2rem;
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
</style>
