<!-- For this to work remember to always add to svelte :head <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script> -->

<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';
	let email = '';
	let gardenSize = '';

	let loading = false;
	let error: string |null = null;

	export let waitlistItem = 'Course';
	export let showGardenDropdown = false;
	export let customSubmitText = '';

	async function handleSubmit(event: SubmitEvent) {
	event.preventDefault();
	loading = true;
	error = null;

	const formData = new FormData();
	formData.append('name', name);
	formData.append('email', email);
	formData.append('waitlist_item', waitlistItem);
	if (showGardenDropdown) formData.append('garden_size', gardenSize);

	// ✅ Get the Turnstile token
	const turnstileToken = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value;
	if (!turnstileToken) {
		error = 'Please complete the challenge before submitting.';
		loading = false;
		return;
	}
	formData.append('cf-turnstile-response', turnstileToken);

	try {
		const res = await fetch('https://submit-form.com/5vtRQ5Glv', {
			method: 'POST',
			body: formData
		});

		if (!res.ok) throw new Error('Failed to submit. Please try again.');

		goto('/success');
	} catch (err: any) {
		error = err.message || 'Something went wrong.';
	} finally {
		loading = false;
	}

}

	
</script>

<form
	action="https://submit-form.com/5vtRQ5Glv"
	method="POST"
>
	<div class="form-group">
		<input
			type="text"
			name="name"
			id="name"
			placeholder="Your Name"
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
			required
		/>
		<label for="email">Email</label>
	</div>

	{#if showGardenDropdown}
		<div class="form-group">
			<select name="garden_size" id="garden_size" required>
				<option value="" disabled selected>Your garden size?</option>
				<option value="no-garden">I don't have a garden yet</option>
				<option value="container">I have a container garden</option>
				<option value="backyard">I have a backyard garden</option>
				<option value="home-large">I have a homestead / huge garden</option>
				<option value="farmer">I'm a farmer</option>
			</select>
			<label for="garden_size">Your Garden Size</label>
		</div>
	{/if}

	<input type="hidden" name="waitlist_item" value={waitlistItem} />
	<input type="hidden" name="_redirect" value="https://solarity.farm/success" />

	<!-- ✅ Turnstile Widget -->
	<div
		class="cf-turnstile"
		data-sitekey="0x4AAAAAABnbCq7SeNRLr0YV"
		data-theme="light"
	></div>

	<!-- ✅ Required by SubmitForm -->
	<button type="submit">
		{customSubmitText ? customSubmitText : `Join ${waitlistItem} Waitlist`}
	</button>
</form>

<p class="text--xs" style="max-width: 500px; margin: auto;">
	By submitting this form you consent to be contacted. Your information is private and handled according to our 
	<a href="/privacy-policy">privacy policy</a>. You can easily unsubscribe at any time!
</p>



