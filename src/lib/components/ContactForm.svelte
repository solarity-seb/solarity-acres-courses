<script lang="ts">
	let name = '';
	let email = '';
	let message = '';

	let loading = false;
	let success = false;
	let error: string | null = null;

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		success = false;
		error = null;

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('message', message);

		try {
			const res = await fetch('https://www.formbackend.com/f/cdb4b4790998ed2b', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) {
				throw new Error('Failed to send message. Please try again.');
			}

			success = true;
			name = '';
			email = '';
			message = '';
		} catch (err: any) {
			error = err.message || 'Something went wrong.';
		} finally {
			loading = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	<div class="form-group">
		<input
			type="text"
			name="name"
			id="name"
			placeholder="Your Name"
			bind:value={name}
			required
		/>
		<label for="name">Name</label>
	</div>
	
	<div class="form-group">
		<input
			type="email"
			name="email"
			id="email"
			placeholder="email@example.com"
			bind:value={email}
			required
		/>
		<label for="email">Email</label>
	</div>
	

	  <div class="form-group">
		
		<textarea id="message" name="message" placeholder="Your Message" rows="5" bind:value={message} required></textarea>
		<label for="message">Message</label>
	</div>

	<button type="submit" disabled={loading}>
		{#if loading}
			Sending…
		{:else}
			Send Message
		{/if}
	</button>

	{#if success}
		<p style="color: var(--text); margin-top: 1rem;">Message sent successfully!</p>
	{/if}

	{#if error}
		<p style="color: var(--danger); margin-top: 1rem;">{error}</p>
	{/if}
</form>
