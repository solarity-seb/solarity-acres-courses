<!-- lib/components/UserProfile.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { invalidateAll } from '$app/navigation';
	
	export let user: any;
	export let form: any = null;
	
	let loading = false;
	
	// Reactive assignments that update when user data changes
	$: updateEmail = user?.email || '';
	$: displayName = user?.user_metadata?.full_name || user?.user_metadata?.display_name || '';
	$: profilePictureUrl = user?.user_metadata?.avatar_url || '';
	
	let fileInput: HTMLInputElement;
	
	// Placeholder management
	let emailFocused = false;
	let nameFocused = false;
	let profileUrlFocused = false;
	
	// Handle form submission state
	$: if (form?.success) {
		// Update local values with the successful form data
		if (form.email) updateEmail = form.email;
		if (form.displayName) displayName = form.displayName;
		if (form.profilePictureUrl) profilePictureUrl = form.profilePictureUrl;
	}

	function handleFileSelect() {
		fileInput?.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			// Create a preview URL for the selected image
			const reader = new FileReader();
			reader.onload = (e) => {
				profilePictureUrl = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<div class="profile-form">
	<h3>Profile Settings</h3>
	
	{#if form?.success}
		<div class="alert alert-success">{form.success}</div>
	{/if}

	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<form method="POST" action="?/updateProfile" enctype="multipart/form-data" use:enhance={() => {
		loading = true;
		return async ({ update, result }) => {
			loading = false;
			await update();
			
			// If the update was successful, invalidate all data to refresh user info
			if (result.type === 'success') {
				await invalidateAll();
			}
		};
	}}>
		<div class="form-section">
			<h4>Profile Picture</h4>
			
			<div class="profile-picture-section">
				<div class="profile-picture-preview">
					{#if profilePictureUrl}
						<img src={profilePictureUrl} alt="Profile" class="profile-img" />
					{:else}
						<div class="profile-placeholder">
							<span>📷</span>
						</div>
					{/if}
				</div>
				
				<div class="profile-picture-controls">
					<input
						type="file"
						name="profilePicture"
						accept="image/*"
						bind:this={fileInput}
						on:change={handleFileChange}
						style="display: none;"
					/>
					<button type="button" class="btn btn-secondary" on:click={handleFileSelect}>
						Choose Picture
					</button>
					<input
						type="text"
						name="profilePictureUrl"
						bind:value={profilePictureUrl}
						placeholder="Or enter image URL"
						class="url-input"
						on:focus={() => profileUrlFocused = true}
						on:blur={() => profileUrlFocused = false}
					/>
				</div>
			</div>
		</div>

		<div class="form-section">
			<h4>Personal Information</h4>
			
			<div class="form-group">
				<input
					id="displayName"
					name="displayName"
					type="text"
					bind:value={displayName}
					disabled={loading}
					placeholder=" "
					on:focus={() => nameFocused = true}
					on:blur={() => nameFocused = false}
				/>
				<label for="displayName">Display Name</label>
			</div>

			<div class="form-group">
				<input
					id="email"
					name="email"
					type="email"
					bind:value={updateEmail}
					required
					disabled={loading}
					placeholder=" "
					on:focus={() => emailFocused = true}
					on:blur={() => emailFocused = false}
				/>
				<label for="email">Email</label>
				<small>Changing your email will require verification</small>
			</div>
		</div>

		<button type="submit" class="btn btn-primary btn-full-width" disabled={loading}>
			{#if loading}
				<span class="loading-spinner"></span>
			{/if}
			Update Profile
		</button>
	</form>
</div>

<style>
	.profile-form {
		max-width: 500px;
		margin: 0 auto;
	}

	.profile-form h3 {
		text-align: center;
		margin-bottom: 2rem;
		color: var(--text-color);
	}

	.profile-picture-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.profile-picture-preview {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--text-color);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--text-light);
	}

	.profile-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-placeholder {
		font-size: 2rem;
		color: var(--text-color);
	}

	.profile-picture-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-items: center;
		text-align: center;
	}

	.url-input {
		width: 100%;
		max-width: 300px;
		padding: 0.5rem;
		border: 1px solid var(--text-light);
		border-radius: var(--btn-border-radius);
		font-size: 0.9rem;
		background-color: var(--bg);
		color: var(--text-color);
	}

	.url-input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.form-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--text-light);
	}

	.form-section:last-of-type {
		border-bottom: none;
		margin-bottom: 2rem;
	}

	.form-section h4 {
		margin-bottom: 1rem;
		color: var(--text-color);
		font-size: 1.1rem;
	}

	.section-desc {
		color: var(--text-light);
		font-size: 0.9rem;
		margin-bottom: 1rem;
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
		margin-bottom: 1.5rem;
		position: relative;
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

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid var(--text-color);
		border-radius: var(--btn-border-radius);
		font-size: 1rem;
		transition: border-color 0.3s;
		background-color: var(--bg);
		color: var(--text-color);
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--accent);
	}

	.form-group input:focus + label,
	.form-group input:not(:placeholder-shown) + label {
		top: -0.5rem;
		font-size: 0.85rem;
		color: var(--accent);
	}

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.form-group small {
		display: block;
		margin-top: 0.25rem;
		color: var(--text-light);
		font-size: 0.8rem;
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
</style>
