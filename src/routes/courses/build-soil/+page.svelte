<svelte:head>
	<meta name="description" content="About this app" />
</svelte:head>

<script lang="ts">
	import TwoCol from '$lib/sections/TwoCol.svelte';
	import CallToAction from '$lib/sections/CallToAction.svelte';
	import PageTitle from '$lib/components/PageTitle.svelte';

  import SEO from '$lib/components/SEO.svelte';

  import Pricing from '$lib/components/Pricing.svelte';
  import PriceTimeline from '$lib/sections/PriceTimeline.svelte';


  import FaqAccordion from '$lib/components/FaqAccordion.svelte';

  const tiers = [
     {
      label: 'Full Booklet',
      price: '1',
      note: '40+ page hand-written booklet'
    },
    {
      label: 'Community',
      price: '2',
      note: 'Exclusive access to a community where you can ask me questions'
    },
    {
      label: 'Updates',
      price: '3',
      note: 'As you ask questions and I learn what problems you face I update'
    },
    {
      label: 'Support',
      price: '4',
      note: 'Feel good about supporting regenerative education'
    }
  ]

  const answers = [
  {
    question: 'Will this work for bermuda grass / twitch grass / dog grass?',
    answer: `Yes. These are all rhizomatic perennial grasses with similar behavior. The strategies in this guide are designed to work across all of them.`
  },
  {
    question: 'Do I need expensive tools or equipment?',
    answer: `Nope. This method uses cheap plastic tarp, cardboard, compost, and materials you might already have (or can get for free). It’s cheap, low-effort, and soil-safe.`
  },
  {
    question: 'Do I have to use plastic?',
    answer: `This method does recommend using a cheap plastic tarp BUT you absolutely do NOT need to use plastic if you don't want to. This guide also includes completely 100% plastic free ways to comepletely kill weeds and discusses the benefits of each method.`
  },
  {
    question: 'What if I already tilled or sprayed?',
    answer: `That’s okay. The guide includes how to recover your soil and restart the process. Many people begin this journey after trying other methods.`
  },
  {
    question: 'Can I use this to start a new garden from scratch?',
    answer: `Yes! In fact, this is one of the best ways to build new garden beds—weed suppression + soil building at the same time.`
  },
  {
    question: 'How long does it take to work?',
    answer: `You’ll see results within a few weeks. Full suppression takes a season or more depending on timing, but the method is low-maintenance and improves your soil while it works.`
  },
   {
    question: 'Is it really easier than weeding by hand?',
    answer: `Absolutely! Weeding perennial grasses by hand is a losing battle. Trust me, I've tried. <br> The methods you'll learn are significantly easier than weeding by hand, AND they're better for your soil health.`
  },
  {
    question: 'Will I need to redo this every year?',
    answer: `No. If done correctly and you install proper border control, this method gives long-term results with just minor seasonal upkeep.`
  },
  {
    question: 'Did you write this with AI?',
    answer: `No! Absolutely not. This is my own writing directly informed by own experience. <br> This was written entirely by me. It is NOT written by ChatGPT. <br> Selling you AI slop would be a profoundly disrespectful thing to do. I put a lot of hard work into this resource and I hope you enjoy it and learn from it!`
  },
   {
    question: '😡 Why are you charging money for this? I thought you wanted to give away knowledge.',
    answer: `The entire reason I started making videos was because I felt hopeless about the world, and wanted to make a difference by educating and inspiring others to support local farms, grow their own food and push for the changes we all want. It's my ultimate goal to share knowledge for free to everyone. <br> I want to share this knowledge as widely as possible, but I also need to pay for things like food, rent, and time. This booklet took me years of trial, error, and research and many many hours to write. I do every single part entirely myself. Charging a small fee lets me keep doing this work sustainably. <br>By buying this booklet, you're directly helping me continue to offer valuable knowledge to people for free! <br>👉 Can't afford it but still want it? <a class="underline" href="/contact">Contact me</a> and I'll give you a copy. <br> Are you in a good spot and want to support my work so I can continue to make free resources for everyone? Consider a <a class="underline" href="/donate"> donation</a>!`
  },
];


const plans = [
		{
			name: 'Free Sample',
			description: 'Aren\'t sure if this is right for you? Try a free sample and you can decide later!',
			price: "0",
			// discountPrice: "49",
			bestValue: false,
			features: [
				{ name: 'Quick summary', available: true },
				{ name: 'Free community access', available: true },
				{ name: 'Free updates for life', available: false },
				{ name: 'Full guide booklet (40+ pages)', available: false },
        
			],
     button: {
			type: 'secondary' as const, // 👈 this is the fix
			text: 'Get Free Sample',
			link: '/checkout',
			newTab: true
		}
		},
    {
			name: 'Instant Download',
			description: 'Purchase the guide and conquer your weeds today!',
			price: "49",
			discountPrice: "24.49",
			bestValue: true,
      badgeText: 'Intro Sale – 50% Off 🎉' ,
			features: [
				{ name: 'Get the full guide booklet (40+ pages)', available: true },
				{ name: 'Lifetime access (re-download at anytime)', available: true },
				{ name: 'Exclusive community access', available: true },
				{ name: 'Ask me questions directly in the community', available: true },
				{ name: 'Early supporter badge in community', available: true },
				{ name: 'Free updates for life', available: true },
			],
     button: {
			type: 'primary' as const, // 👈 this is the fix
			text: 'Purchase Now!',
			link: '/checkout',
			newTab: true
		}
		}
	];
</script>


<SEO
  title="How to Get Rid of Couchgrass Forever"
  description="Learn the no-till, no-pesticide, emotionally healing method to eliminate couchgrass, quackgrass, and rhizomatic grasses from your garden for good."
  url="/booklet/quackgrass"
  noIndex={false}
/>

<PageTitle
  subheading="The <strong>easiest</strong> way to get rid of all grasses."
  alignment="center"
  bg="bg1"
>
  <svelte:fragment slot="top">
    <p class="eyebrow">New Booklet</p>
    <h1>
      Get Rid of <em>Perennial Grasses</em> without chemicals or tilling
    </h1>
  </svelte:fragment>
</PageTitle>




<section>
  <div class="flex-grid">
    <div class="col-3">
      <h2>FAQ</h2>
      <p>Have a question?</p>
    </div>
    <div class="col-9">
      <FaqAccordion faqs={answers} theme="light" />
    </div>
    <div class="col-12 u-text-center">
      <p class="text--sm">Have another question? Ask me directly <a href="/contact" class="underline">here</a>.</p>
    </div>
  </div>
</section>

<Pricing {plans} />