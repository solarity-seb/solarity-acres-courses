<script lang="ts">
  import CourseLanding from '$lib/components/CourseLanding.svelte';

  const courseData = {
    id: 'organic-farming-mastery',
    title: 'Organic Farming Mastery',
    description: 'Master the art and science of organic farming with our comprehensive course designed for beginners and experienced growers alike.',
    price: '297',
    discountPrice: '197',
    duration: '8 weeks',
    level: 'Beginner to Intermediate',
    image: '/images/organic-farming-course.jpg',
    syllabus: [
      'Introduction to Organic Principles',
      'Soil Building & Composting',
      'Seed Starting & Plant Care',
      'Natural Pest Management',
      'Crop Rotation & Planning',
      'Harvesting & Post-Harvest',
      'Season Extension Techniques',
      'Building Your Farm Business'
    ],
    learningOutcomes: [
      'Understand organic farming principles and certification',
      'Build and maintain healthy soil ecosystems',
      'Plan and implement crop rotations',
      'Manage pests and diseases naturally',
      'Design efficient farming systems',
      'Market and sell your organic produce',
      'Create sustainable farming practices',
      'Build a profitable farm business'
    ],
    instructor: {
      name: 'Dr. Elena Martinez',
      bio: 'Dr. Elena Martinez has over 15 years of experience in organic farming and sustainable agriculture. She holds a PhD in Soil Science and has helped thousands of farmers transition to organic methods.',
      image: '/images/instructor-elena.jpg'
    },
    testimonials: [
      {
        name: 'James Thompson',
        comment: 'This course gave me the confidence to start my own organic farm. The instructor is incredibly knowledgeable!',
        rating: 5
      },
      {
        name: 'Maria Gonzalez',
        comment: 'Excellent content and practical advice. I\'ve already implemented several techniques on my farm.',
        rating: 5
      },
      {
        name: 'David Kim',
        comment: 'Worth every penny. The business module alone helped me increase my profits by 40%.',
        rating: 5
      }
    ],
    cta: {
      text: 'Enroll Now',
      link: '/checkout?course=organic-farming-mastery',
      type: 'primary' as const
    },
    trialCta: {
      text: 'Free Preview',
      link: '/courses/organic-farming-mastery/preview'
    }
  };
</script>

<CourseLanding course={courseData} />
