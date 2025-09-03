<script lang="ts">
  export let course: {
    id: string;
    title: string;
    description: string;
    price: string;
    discountPrice?: string;
    duration: string;
    level: string;
    image?: string;
    syllabus: string[];
    learningOutcomes: string[];
    instructor: {
      name: string;
      bio: string;
      image?: string;
    };
    testimonials?: Array<{
      name: string;
      comment: string;
      rating: number;
    }>;
    cta: {
      text: string;
      link: string;
      type: 'primary' | 'secondary';
    };
    trialCta?: {
      text: string;
      link: string;
    };
  };
</script>

<svelte:head>
  <title>{course.title} | Solarity Studio</title>
  <meta name="description" content={course.description} />
</svelte:head>

<main class="course-landing">
  <section class="hero bg1">
    <div class="grid-container">
      <div class="grid-x grid-margin-x align-middle">
        <div class="cell large-6">
          <h1 class="hero-title">{course.title}</h1>
          <p class="hero-description">{course.description}</p>
          
          <div class="course-meta">
            <div class="meta-item">
              <strong>Duration:</strong> {course.duration}
            </div>
            <div class="meta-item">
              <strong>Level:</strong> {course.level}
            </div>
            <div class="meta-item">
              <strong>Price:</strong> 
              {#if course.discountPrice}
                <span class="original-price">${course.price}</span>
                <span class="discount-price">${course.discountPrice}</span>
              {:else}
                <span class="price">${course.price}</span>
              {/if}
            </div>
          </div>

          <div class="cta-section">
            <a 
              href={course.cta.link} 
              class="btn btn-{course.cta.type}"
              aria-label="Enroll in {course.title}"
            >
              {course.cta.text}
            </a>
            {#if course.trialCta}
              <a 
                href={course.trialCta.link} 
                class="btn btn-secondary btn-outline"
                aria-label="Try {course.title} for free"
              >
                {course.trialCta.text}
              </a>
            {/if}
          </div>
        </div>
        {#if course.image}
          <div class="cell large-6">
            <img src={course.image} alt={course.title} class="hero-image" />
          </div>
        {/if}
      </div>
    </div>
  </section>

  <section class="learning-outcomes bg2">
    <div class="grid-container">
      <h2 class="section-title text-center">What You'll Learn</h2>
      <div class="grid-x grid-margin-x">
        <div class="cell large-8 large-offset-2">
          <ul class="outcomes-list">
            {#each course.learningOutcomes as outcome}
              <li class="outcome-item">
                <span class="checkmark">✓</span>
                {outcome}
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="syllabus bg3">
    <div class="grid-container">
      <h2 class="section-title text-center">Course Syllabus</h2>
      <div class="grid-x grid-margin-x">
        <div class="cell large-8 large-offset-2">
          <div class="syllabus-list">
            {#each course.syllabus as module, index}
              <div class="module-item">
                <span class="module-number">{index + 1}</span>
                <span class="module-title">{module}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="instructor bg1">
    <div class="grid-container">
      <h2 class="section-title text-center">Meet Your Instructor</h2>
      <div class="grid-x grid-margin-x align-center">
        <div class="cell large-8">
          <div class="instructor-card">
            {#if course.instructor.image}
              <img src={course.instructor.image} alt={course.instructor.name} class="instructor-image" />
            {/if}
            <div class="instructor-info">
              <h3 class="instructor-name">{course.instructor.name}</h3>
              <p class="instructor-bio">{course.instructor.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {#if course.testimonials && course.testimonials.length > 0}
    <section class="testimonials bg2">
      <div class="grid-container">
        <h2 class="section-title text-center">Student Reviews</h2>
        <div class="grid-x grid-margin-x">
          {#each course.testimonials as testimonial}
            <div class="cell large-4">
              <div class="testimonial-card">
                <div class="rating">
                  {#each Array(testimonial.rating) as _}
                    <span class="star">★</span>
                  {/each}
                </div>
                <p class="comment">"{testimonial.comment}"</p>
                <p class="author">- {testimonial.name}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <section class="final-cta bg3">
    <div class="grid-container text-center">
      <h2>Ready to Start Learning?</h2>
      <p>Join thousands of students who have transformed their skills</p>
      <div class="cta-buttons">
        <a 
          href={course.cta.link} 
          class="btn btn-{course.cta.type} btn-large"
          aria-label="Enroll in {course.title}"
        >
          {course.cta.text}
        </a>
        {#if course.trialCta}
          <a 
            href={course.trialCta.link} 
            class="btn btn-secondary btn-outline btn-large"
            aria-label="Try {course.title} for free"
          >
            {course.trialCta.text}
          </a>
        {/if}
      </div>
    </div>
  </section>
</main>

<style>
  .course-landing {
    min-height: 100vh;
  }

  .hero {
    padding: 4rem 0;
  }

  .hero-title {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--dark);
  }

  .hero-description {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: var(--grey);
  }

  .course-meta {
    margin-bottom: 2rem;
  }

  .meta-item {
    margin-bottom: 0.5rem;
    font-size: 1.1rem;
  }

  .original-price {
    text-decoration: line-through;
    color: var(--grey);
    margin-right: 0.5rem;
  }

  .discount-price {
    color: var(--success);
    font-weight: bold;
  }

  .price {
    color: var(--dark);
    font-weight: bold;
  }

  .cta-section {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .hero-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .learning-outcomes, .syllabus, .instructor, .testimonials, .final-cta {
    padding: 4rem 0;
  }

  .section-title {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: var(--dark);
  }

  .outcomes-list {
    list-style: none;
    padding: 0;
  }

  .outcome-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .checkmark {
    background: var(--success);
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
  }

  .syllabus-list {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .module-item {
    display: flex;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
  }

  .module-item:last-child {
    border-bottom: none;
  }

  .module-number {
    background: var(--accent);
    color: white;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: bold;
  }

  .module-title {
    font-size: 1.1rem;
    color: var(--dark);
  }

  .instructor-card {
    display: flex;
    align-items: center;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    gap: 2rem;
  }

  .instructor-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
  }

  .instructor-name {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--dark);
  }

  .instructor-bio {
    font-size: 1.1rem;
    color: var(--grey);
    line-height: 1.6;
  }

  .testimonial-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    text-align: center;
  }

  .rating {
    margin-bottom: 1rem;
  }

  .star {
    color: #ffc107;
    font-size: 1.5rem;
  }

  .comment {
    font-style: italic;
    margin-bottom: 1rem;
  }

  .author {
    font-weight: bold;
    color: var(--dark);
  }

  .cta-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: 1.25rem;
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--accent);
    color: var(--accent);
  }

  .btn-outline:hover {
    background: var(--accent);
    color: white;
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }

    .section-title {
      font-size: 2rem;
    }

    .instructor-card {
      flex-direction: column;
      text-align: center;
    }

    .cta-section, .cta-buttons {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
