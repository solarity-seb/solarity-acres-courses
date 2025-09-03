<script lang="ts">
	export let plans: {
		name: string;
		description: string;
		price: string;
		discountPrice?: string;
		bestValue?: boolean;
		badgeText?: string;
		features: { name: string; available: boolean }[];
		button?: {
		type: 'primary' | 'secondary' | 'line';
		text: string;
		link: string;
		newTab?: boolean;
		ariaLabel?: string;
	};
	}[] = [];

	import Buttons from "./Buttons.svelte";

	function splitPrice(price: string) {
	const [dollars, cents] = price.split('.');
	return {
		dollars,
		cents: cents
	};
}

</script>

<section class="pricing">
	<div class="container">
		{#each plans as plan}
			<div class="card-border">
				<article class="pricing-card {plan.bestValue ? 'featured' : ''}">
					{#if plan.bestValue}
						<div class="badge text--xs">{plan.badgeText ?? 'Recommended'}</div>
					{/if}

					<h2 class="text--md">{plan.name}</h2>
					<p class="description">{plan.description}</p>

					<div class="price-wrapper">
						{#if plan.discountPrice}
							<div class="price-content inline">
								{#if plan.discountPrice}
	{#await Promise.resolve(splitPrice(plan.price)) then original}
		<span class="original-price">
			${original.dollars}<sup>{original.cents}</sup>
		</span>
	{/await}
{/if}
								<div class="price-line">
									{#await Promise.resolve(splitPrice(plan.discountPrice)) then discount}
	<span class="discount-price">
		${discount.dollars}<sup>{discount.cents}</sup>
	</span>
{/await}

									<span class="currency-label">USD</span>
								</div>
								<span class="early-bird text--xs">Early Bird Price</span>
							</div>
						{:else}
							<div class="price-content inline">
								<div class="price-line">
									<span class="discount-price">${plan.price}</span>
									<span class="currency-label">USD</span>
								</div>
							</div>
						{/if}
					</div>

					<ul class="features">
						{#each plan.features as feature}
							{#if feature.name}
								<li class:available={feature.available}>
									{#if feature.available}
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
									{:else}
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
									{/if}
									<span>{feature.name}</span>
								</li>
							{/if}
						{/each}
					</ul>

					<div class="pricing-btn-container">
						{#if plan.button}
	{#if plan.button.type === 'primary'}
	<Buttons
		fullWidth={true}
		centered={true}
		primaryText={plan.button.text}
		primaryLink={plan.button.link}
		primaryNewTab={plan.button.newTab}
		primaryAriaLabel={plan.button.ariaLabel}
	/>
{:else if plan.button.type === 'secondary'}
	<Buttons
		fullWidth={true}
		centered={true}
		secondaryText={plan.button.text}
		secondaryLink={plan.button.link}
		secondaryNewTab={plan.button.newTab}
		secondaryAriaLabel={plan.button.ariaLabel}
	/>
{:else if plan.button.type === 'line'}
	<Buttons
		fullWidth={true}
		centered={true}
		lineText={plan.button.text}
		lineLink={plan.button.link}
		lineNewTab={plan.button.newTab}
		lineAriaLabel={plan.button.ariaLabel}
	/>
{/if}

{/if}
					</div>

				</article>
			</div>
		{/each}
	</div>
</section>

<style>
	.pricing .container {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		justify-content: center;
		padding: 3rem 1rem;
		background: var(--bg);
		color: var(--text-color);
	}

	.pricing-card {
		flex: 1 1 300px;
		max-width: 350px;
		background: var(--bg-gradient);
		border-radius: 1rem;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
		padding: 2rem;
		position: relative;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid var(--bg);
	}

	.pricing-card:hover {
		box-shadow: 0 6px 30px rgba(255, 255, 255, 0.5);
	}

	.featured {
		border: 2px solid var(--accent);
	}

	.badge {
		position: absolute;
		top: -0.9rem;
		right: 1rem;
		background: var(--accent);
		color: var(--light);
		padding: 0.25rem 0.75rem;
		border-radius: 999px;
	}

	h2 {
		margin: 0;
		color: var(--accent);
	}

	.description {
		margin: 0.5rem 0 1.5rem;
		font-size: 0.95rem;
		color: var(--grey-700);
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.features li {
	display: flex;
	align-items: flex-start; /* align icon and text at the top */
	gap: 0.5rem;
	color: var(--grey-700);
}

.features li svg {
	width: 16px;
	height: 16px;
	flex-shrink: 0; /* prevents it from shrinking when space is tight */
	margin-top: 0.2rem; /* optional: helps visually align with text baseline */
}


	.features li.available {
		color: var(--text-color);
	}

    .card-border {
        border: 1px solid var(--grey-300);;
        padding: 8px;
        border-radius: 1.2rem;
    }

	.price-wrapper {
  margin: 0.75rem 0 1.25rem;
}

.price-content.inline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-line {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.currency-label {
  font-size: var(--text-xs);
  color: var(--grey-700);
}

.discount-price {
  color: var(--accent);
  font-size: var(--text-xxl);
  font-weight: 800;
}

.original-price {
  text-decoration: line-through;
  color: var(--grey-700);
  font-size: var(--text-md);
}

.early-bird {
	margin-top: -0.7rem;
  font-size: var(--text-xs);
}
.pricing-btn-container {
	margin-top: 2em;
}
.discount-price sup,
.original-price sup {
	font-size: 0.4em;
	font-weight: 300;
	position: relative;
	top: -0.2em;
	margin-left: 0.05em;
}

</style>
