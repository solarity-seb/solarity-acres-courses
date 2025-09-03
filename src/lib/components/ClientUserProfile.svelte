<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { uploadProfileImage, validateImageFile, deleteProfileImage } from '$lib/utils/storageUtilsNew';
	import type { User } from '@supabase/supabase-js';
	
	interface UserMetadata {
		display_name?: string;
		full_name?: string;
		avatar_url?: string;
		[key: string]: any;
	}
	
	interface UserWithMetadata extends User {
		user_metadata: UserMetadata;
	}
	
	let { data } = $props();
	let { supabase } = $derived(data);
	
	// Client-side user management
	let user = $state<UserWithMetadata | null>(null);
	let loading = $state(false);
	let uploading = $state(false);
	let message = $state('');
	let error = $state('');
	
	// Form fields
	let updateEmail = $state('');
	let displayName = $state('');
	let profilePictureUrl = $state('');
	let fileInput = $state<HTMLInputElement>();
	let selectedFile = $state<File | null>(null);
	
	onMount(async () => {
		// Get current user
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (currentUser) {
			// Cast to our enhanced user type
			user = currentUser as UserWithMetadata;
			updateEmail = user.email || '';
			const userMetadata = user.user_metadata || {};
			displayName = userMetadata.display_name || userMetadata.full_name || '';
			profilePictureUrl = userMetadata.avatar_url || '';
		}
	});

	function handleFileSelect() {
		fileInput?.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (file) {
			// Validate file first
			const validation = validateImageFile(file);
			if (!validation.valid) {
				error = validation.error || 'Invalid file';
				return;
			}

			// Clear any previous errors
			error = '';
			
			// Create a preview URL for the selected image
			const reader = new FileReader();
			reader.onload = (e) => {
				profilePictureUrl = e.target?.result as string;
			};
			reader.readAsDataURL(file);
			
			// Store file for upload
			selectedFile = file;
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		error = '';
		message = '';

		try {
			let finalAvatarUrl = profilePictureUrl;
			
			// Upload new file if selected
			if (selectedFile && user) {
				uploading = true;
				
				// Delete old profile image first if it exists and is from our storage
				const userMetadata = user.user_metadata || {};
				if (userMetadata.avatar_url && 
					userMetadata.avatar_url.includes('/storage/v1/object/public/profile-images/')) {
					await deleteProfileImage(userMetadata.avatar_url, supabase);
				}
				
				// Automatically resize image for profile picture (300x300 max, maintain aspect ratio)
				const { compressImage } = await import('$lib/utils/storageUtils');
				const resizedFile = await compressImage(selectedFile, 0.85, 300, 300);
				
				const uploadResult = await uploadProfileImage(resizedFile, user.id, supabase, 'client');
				
				if (!uploadResult.success) {
					if (uploadResult.rateLimited) {
						error = 'Too many uploads. Please wait before trying again.';
					} else {
						error = uploadResult.error || 'Upload failed';
					}
					uploading = false;
					loading = false;
					return;
				}
				
				finalAvatarUrl = uploadResult.url!;
				selectedFile = null; // Clear selected file
				uploading = false;
			}

			// Prepare updates
			const updates: any = {
				data: {
					full_name: displayName,
					display_name: displayName,
					avatar_url: finalAvatarUrl
				}
			};

			// Update email if changed
			if (updateEmail && updateEmail !== user?.email) {
				updates.email = updateEmail;
			}

			// Update user using client-side auth
			const { data: updatedUser, error: updateError } = await supabase.auth.updateUser(updates);
			
			if (updateError) {
				error = updateError.message;
			} else {
				message = 'Profile updated successfully!';
				if (updatedUser.user) {
					user = updatedUser.user as UserWithMetadata;
				}
				profilePictureUrl = finalAvatarUrl; // Update the display URL
			}
		} catch (err: any) {
			console.error('Profile update error:', err);
			error = err.message || 'An unexpected error occurred';
		} finally {
			loading = false;
			uploading = false;
		}
	}
</script>

<div class="profile-form">
	<h3>Profile Settings</h3>
	
	{#if message}
		<div class="alert alert-success">{message}</div>
	{/if}

	{#if error}
		<div class="alert alert-error">{error}</div>
	{/if}

	{#if user}
		<form onsubmit={handleSubmit}>
			<div class="form-section">
				<h4>Profile Picture</h4>
				
				<div class="profile-image-container">
					{#if profilePictureUrl}
						<img src={profilePictureUrl} alt="Profile" class="profile-image" />
					{:else}
						<div class="profile-placeholder">
							<span>�</span>
						</div>
					{/if}
					
					<button 
						type="button" 
						class="image-upload-overlay" 
						onclick={handleFileSelect}
						disabled={uploading || loading}
						title="Change profile picture"
					>
						{#if uploading}
							<span class="loading-spinner"></span>
						{:else}
							📷
						{/if}
					</button>
				</div>

				{#if uploading}
					<div class="upload-progress">
						<span class="loading-spinner"></span>
						Resizing and uploading image...
					</div>
				{/if}
				
				<div class="profile-picture-controls">
					<input
						type="file"
						accept="image/*"
						bind:this={fileInput}
						onchange={handleFileChange}
						style="display: none;"
					/>
					{#if !selectedFile}
						<div class="form-group">
							<input
								id="profileUrl"
								type="url"
								bind:value={profilePictureUrl}
								disabled={uploading || loading}
								placeholder=" "
							/>
							<label for="profileUrl">Or enter image URL</label>
						</div>
					{/if}
					{#if selectedFile}
						<div class="file-info">
							<small>Selected: {selectedFile.name} (will be resized to 300x300)</small>
							<button 
								type="button" 
								class="btn-clear" 
								onclick={() => {
									selectedFile = null;
									const userMetadata = user?.user_metadata || {};
									profilePictureUrl = userMetadata.avatar_url || '';
								}}
								disabled={uploading || loading}
							>
								Clear
							</button>
						</div>
					{/if}
				</div>
			</div>

			<div class="form-section">
				<h4>Personal Information</h4>
				
				<div class="form-group">
					<input
						id="displayName"
						type="text"
						bind:value={displayName}
						disabled={loading}
						placeholder=" "
					/>
					<label for="displayName">Display Name</label>
				</div>

				<div class="form-group">
					<input
						id="email"
						type="email"
						bind:value={updateEmail}
						required
						disabled={loading}
						placeholder=" "
					/>
					<label for="email">Email</label>
					<small>Changing your email will require verification</small>
				</div>
			</div>

			<button type="submit" class="btn btn-primary btn-full-width" disabled={loading || uploading}>
				{#if uploading}
					<span class="loading-spinner"></span>
					Uploading Image...
				{:else if loading}
					<span class="loading-spinner"></span>
					Updating Profile...
				{:else}
					Update Profile
				{/if}
			</button>
		</form>
	{:else}
		<p>Loading user data...</p>
	{/if}
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

	.url-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.file-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}

	.file-info small {
		color: var(--text-light);
		font-size: 0.8rem;
	}

	.btn-clear {
		background: none;
		border: 1px solid var(--text-light);
		color: var(--text-color);
		padding: 0.25rem 0.5rem;
		border-radius: var(--btn-border-radius);
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-clear:hover {
		background-color: var(--text-light);
		color: var(--bg);
	}

	.btn-clear:disabled {
		opacity: 0.5;
		cursor: not-allowed;
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

	.profile-image-container {
		position: relative;
		width: 150px;
		height: 150px;
		margin: 0 auto 1.5rem;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--border-color);
		background: var(--bg2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.profile-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.profile-placeholder {
		width: 60px;
		height: 60px;
		background: var(--text-light);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		color: var(--bg2);
	}

	.image-upload-overlay {
		position: absolute;
		bottom: 0;
		right: 0;
		background: var(--accent);
		color: white;
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1.2rem;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px rgba(0,0,0,0.2);
	}

	.image-upload-overlay:hover {
		background: var(--accent-dark);
		transform: scale(1.1);
	}

	.image-upload-overlay:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.upload-progress {
		text-align: center;
		margin-top: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-light);
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
</style>
