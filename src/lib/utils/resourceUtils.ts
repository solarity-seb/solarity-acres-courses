import type { SupabaseClient } from '@supabase/supabase-js';

export interface Resource {
  id: string;
  title: string;
  description: string;
  content: string;
  features: string[];
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResource {
  userId: string;
  resourceId: string;
  enrolledAt: string;
  progress?: number;
  completed?: boolean;
}

export interface ResourceCollection {
  resources: Resource[];
  userResources: UserResource[];
}

/**
 * Available resources in the system
 */
export const AVAILABLE_RESOURCES: Resource[] = [
  {
    id: 'soil-health-guide',
    title: 'Complete Soil Health Guide',
    description: 'Transform your garden with our comprehensive guide to building healthy, living soil that grows nutrient-dense plants naturally.',
    content: `
# Complete Soil Health Guide

## Chapter 1: Understanding Soil Biology
Soil is not just dirt - it's a living ecosystem teeming with billions of microorganisms that work together to create the foundation for all plant life. Understanding this complex web of relationships is the first step to building truly healthy soil.

### The Soil Food Web
- **Bacteria**: Break down organic matter and fix nitrogen
- **Fungi**: Create networks that transport nutrients and water
- **Protozoa**: Release nutrients by consuming bacteria and fungi
- **Nematodes**: Control pest populations and cycle nutrients
- **Arthropods**: Fragment organic matter and aerate soil
- **Earthworms**: Create stable soil structure and deposit nutrient-rich castings

## Chapter 2: Soil Testing & Analysis
Before you can improve your soil, you need to understand what you're working with. Proper testing reveals the current state of your soil's physical, chemical, and biological properties.

### Essential Tests
1. **pH Level** - Determines nutrient availability
2. **Nutrient Content** - NPK and micronutrients
3. **Organic Matter** - Measures soil life and structure
4. **Soil Texture** - Clay, silt, and sand percentages
5. **Compaction Level** - Affects root growth and water infiltration

### Reading Your Results
- pH 6.0-7.0: Optimal for most vegetables
- Organic matter >3%: Good soil health
- Available nutrients should be balanced

## Chapter 3: Building Soil Structure
Healthy soil structure creates spaces for air, water, and root growth while providing stability that prevents erosion.

### Key Strategies
- **Add organic matter regularly** through compost, mulch, and cover crops
- **Minimize tillage** to preserve soil structure
- **Use raised beds** to prevent compaction
- **Plant cover crops** to protect and feed the soil
- **Create permanent pathways** to avoid stepping on growing areas

## Chapter 4: Composting for Soil Health
Compost is the ultimate soil amendment, providing nutrients, improving structure, and introducing beneficial microorganisms.

### Hot Composting Method
1. Layer 3 parts brown materials (carbon) to 1 part green materials (nitrogen)
2. Maintain moisture like a wrung-out sponge
3. Turn every 2-3 weeks for proper aeration
4. Monitor temperature (130-160°F optimal)
5. Finished compost ready in 2-4 months

### Cold Composting Method
- Simply layer materials and let nature take its course
- Takes 6-18 months but requires no turning
- Perfect for busy gardeners
- Add materials as available

## Chapter 5: Natural Soil Amendments
Enhance your soil with natural materials that provide specific benefits without disrupting the soil ecosystem.

### Organic Amendments
- **Aged manure**: Slow-release nutrients and organic matter
- **Bone meal**: Phosphorus for root development
- **Kelp meal**: Trace minerals and growth hormones
- **Fish emulsion**: Quick nitrogen boost
- **Rock dust**: Long-term mineral supplementation
- **Biochar**: Carbon sequestration and water retention

### Application Guidelines
- Test soil first to identify specific needs
- Apply amendments in spring or fall
- Water in thoroughly after application
- Monitor plants for response

## Chapter 6: Seasonal Soil Care
Soil health requires year-round attention with different focuses throughout the seasons.

### Spring Preparation
- Test soil after winter
- Add compost before planting
- Plant nitrogen-fixing cover crops
- Begin regular watering schedule

### Summer Maintenance
- Mulch heavily to retain moisture
- Deep water less frequently
- Side-dress heavy feeders
- Monitor for pest and disease issues

### Fall Restoration
- Plant winter cover crops
- Add leaf mold and organic matter
- Protect exposed soil with mulch
- Plan next year's crop rotations

### Winter Protection
- Maintain mulch cover
- Avoid walking on frozen soil
- Plan and order amendments
- Study and prepare for next season

## Troubleshooting Common Problems

### Compacted Soil
- **Symptoms**: Water pools on surface, poor plant growth
- **Solutions**: Add organic matter, use broadfork, avoid working wet soil

### Poor Drainage
- **Symptoms**: Standing water, root rot, yellowing plants
- **Solutions**: Create raised beds, add coarse organic matter, install drainage

### Low Fertility
- **Symptoms**: Pale plants, slow growth, poor yields
- **Solutions**: Add compost, use organic fertilizers, plant legumes

### pH Imbalance
- **Symptoms**: Nutrient deficiencies despite fertilizing
- **Solutions**: Add lime to raise pH, sulfur to lower pH, test regularly

## Advanced Techniques

### No-Till Gardening
Preserve soil structure and biology by avoiding mechanical disturbance:
- Use mulch instead of tillage
- Plant through mulch
- Build soil layers naturally
- Let earthworms do the tilling

### Mycorrhizal Inoculation
Enhance plant-fungi partnerships:
- Purchase mycorrhizal inoculant
- Apply at planting time
- Avoid high-phosphorus fertilizers
- Maintain fungal networks through minimal disturbance

### Bioregional Soil Building
Work with your local ecosystem:
- Use native plant materials
- Source local organic matter
- Adapt techniques to climate
- Learn from local soil experts

Remember: Building healthy soil is a long-term investment that pays dividends in healthier plants, better yields, and more resilient gardens. Start with small changes and build your soil health program over time.
    `,
    features: [
      'Soil Testing & Analysis',
      'Composting Techniques', 
      'Natural Amendments',
      'Microbial Health',
      'pH Management',
      'Seasonal Care'
    ],
    image: '/images/soil-guide-preview.jpg',
    category: 'Soil Health',
    createdAt: '2024-01-15',
    updatedAt: '2024-08-15'
  },
  {
    id: 'organic-pest-control',
    title: 'Organic Pest Control Mastery',
    description: 'Learn sustainable, chemical-free methods to protect your plants while supporting beneficial insects and maintaining ecological balance.',
    content: `
# Organic Pest Control Mastery

## Chapter 1: Understanding Integrated Pest Management (IPM)

Organic pest control isn't about eliminating all insects - it's about creating balance. Integrated Pest Management (IPM) is a holistic approach that uses multiple strategies to maintain pest populations at acceptable levels while protecting beneficial organisms.

### The IPM Pyramid
1. **Prevention** - Cultural practices that prevent problems
2. **Monitoring** - Regular observation and identification
3. **Biological Control** - Using nature's pest controllers
4. **Mechanical Control** - Physical barriers and traps
5. **Organic Sprays** - Last resort, targeted applications

### Key Principles
- **Identify before you act** - Know what you're dealing with
- **Use thresholds** - Not every pest requires intervention
- **Start with gentlest methods** - Escalate only when necessary
- **Preserve beneficials** - Protect your natural allies
- **Monitor results** - Track what works and what doesn't

## Chapter 2: Prevention Through Garden Design

The best pest control starts with smart garden planning that creates an environment where plants thrive and pests struggle.

### Companion Planting
Strategic plant combinations that naturally repel pests:

**Classic Combinations:**
- **Tomatoes + Basil**: Basil repels aphids, whiteflies, and hornworms
- **Carrots + Chives**: Chives deter carrot rust flies
- **Cucumbers + Nasturtiums**: Nasturtiums trap cucumber beetles
- **Corn + Beans + Squash**: Three Sisters reduce many pests
- **Roses + Garlic**: Garlic deters aphids and black spot

**Beneficial Plant Borders:**
- **Yarrow**: Attracts predatory insects
- **Dill**: Hosts beneficial wasps
- **Sweet Alyssum**: Provides nectar for tiny parasitoids
- **Fennel**: Attracts hoverflies and lacewings
- **Calendula**: Repels nematodes and aphids

### Crop Rotation
Break pest cycles by rotating plant families:
- **Year 1**: Nightshades (tomatoes, peppers, eggplant)
- **Year 2**: Brassicas (cabbage, broccoli, kale)
- **Year 3**: Legumes (beans, peas)
- **Year 4**: Root vegetables (carrots, beets, radishes)

### Physical Barriers
- **Row covers**: Protect from flying pests
- **Copper tape**: Deters slugs and snails
- **Cardboard collars**: Prevent cutworm damage
- **Mulch**: Reduces soil-dwelling pests
- **Trellis systems**: Improve air circulation

## Chapter 3: Identifying Common Garden Pests

Accurate identification is crucial for effective control. Here's how to recognize and understand common garden pests.

### Aphids
**Identification**: Small, soft-bodied insects in green, black, or white
**Damage**: Yellowing leaves, stunted growth, sticky honeydew
**Life Cycle**: Rapid reproduction, multiple generations per season
**Natural Enemies**: Ladybugs, lacewings, parasitic wasps

### Caterpillars
**Common Types**: Cabbage worms, hornworms, cutworms, armyworms
**Identification**: Look for chewed leaves and frass (droppings)
**Damage**: Holes in leaves, stems cut at soil level
**Natural Enemies**: Birds, predatory beetles, parasitic wasps

### Spider Mites
**Identification**: Tiny spiders, fine webbing on plants
**Damage**: Stippled, yellowing leaves
**Conditions**: Hot, dry weather favors infestations
**Natural Enemies**: Predatory mites, ladybugs, humidity

### Whiteflies
**Identification**: Small white flying insects on leaf undersides
**Damage**: Yellowing leaves, sticky honeydew, virus transmission
**Life Cycle**: Eggs and nymphs on leaf undersides
**Natural Enemies**: Parasitic wasps, sticky traps

### Slugs and Snails
**Identification**: Slimy trails, irregular holes in leaves
**Activity**: Most active at night and in wet conditions
**Damage**: Seedlings, soft leaves, fruits
**Control**: Reduce moisture, barriers, traps

## Chapter 4: Biological Pest Control

Harness the power of beneficial insects, animals, and microorganisms to control pests naturally.

### Beneficial Insects
**Predators:**
- **Ladybugs**: Consume 50+ aphids per day
- **Lacewings**: Larvae eat aphids, mites, small caterpillars
- **Ground beetles**: Control soil-dwelling pests
- **Praying mantis**: General predators of many insects
- **Assassin bugs**: Pierce and drain pest insects

**Parasitoids:**
- **Trichogramma wasps**: Parasitize moth and butterfly eggs
- **Aphidius wasps**: Parasitize aphids
- **Braconid wasps**: Control caterpillars and aphids
- **Encarsia wasps**: Control whiteflies

### Attracting Beneficials
**Habitat Requirements:**
- **Diverse flowering plants** for nectar sources
- **Overwintering sites** like leaf litter and brush piles
- **Water sources** such as shallow dishes or bird baths
- **Shelter** provided by perennial plantings
- **Minimal pesticide use** to preserve populations

**Beneficial Plant Menu:**
- **Early season**: Crocuses, wild cherry, willow
- **Late spring**: Hawthorn, serviceberry, wild plum
- **Summer**: Native wildflowers, herbs, buckwheat
- **Fall**: Asters, goldenrod, Joe Pye weed

### Purchasing Beneficials
**When to Buy:**
- Severe infestations beyond natural control
- New gardens lacking beneficial populations
- Greenhouses and enclosed spaces
- Specific pest problems requiring targeted solutions

**Release Guidelines:**
- Time releases with pest presence
- Release in evening to reduce dispersal
- Provide food and water sources
- Follow supplier instructions exactly
- Monitor establishment and effectiveness

## Chapter 5: Mechanical and Physical Controls

Sometimes the simplest solutions are the most effective. Physical controls can prevent pest problems without any environmental impact.

### Hand-Picking
**Best for**: Large, visible pests like hornworms, beetles, caterpillars
**Timing**: Early morning when pests are sluggish
**Technique**: Drop pests into soapy water
**Frequency**: Daily monitoring during peak seasons

### Traps and Barriers
**Yellow Sticky Traps:**
- Attract aphids, whiteflies, fungus gnats
- Place just above plant canopy
- Replace when fully covered
- Monitor weekly for pest trends

**Pheromone Traps:**
- Species-specific attraction
- Useful for monitoring and timing treatments
- Examples: Codling moth, oriental fruit moth
- Follow manufacturer instructions for placement

**Beer Traps for Slugs:**
- Shallow containers filled with beer
- Place at soil level around affected plants
- Empty and refill every 2-3 days
- Most effective during wet weather

### Water Sprays
**High-pressure water:**
- Dislodges aphids, mites, small caterpillars
- Use garden hose with spray attachment
- Apply in morning so plants dry quickly
- Repeat every 2-3 days as needed

## Chapter 6: Organic Spray Solutions

When prevention and biological controls aren't sufficient, organic sprays can provide targeted pest control with minimal environmental impact.

### Soap Sprays
**Homemade Recipe:**
- 1-2 tablespoons pure liquid soap per quart water
- Add 1 tablespoon vegetable oil for better adherence
- Spray early morning or evening
- Test on small area first

**Commercial Options:**
- Insecticidal soaps specifically formulated for plants
- Less likely to damage sensitive plants
- Often include additional beneficial ingredients

### Neem Oil
**Active ingredient**: Azadirachtin from neem tree
**Mode of action**: Disrupts insect feeding and reproduction
**Effective against**: Aphids, whiteflies, spider mites, scale
**Application**: Spray every 7-14 days, avoid flowering plants when bees are active

### Diatomaceous Earth (DE)
**Type**: Food-grade only
**Mode of action**: Physical damage to insect exoskeletons
**Effective against**: Crawling insects, slugs, flea beetles
**Application**: Dust on plants and soil, reapply after rain
**Precautions**: Wear mask during application, avoid beneficial insects

### Bacillus thuringiensis (Bt)
**Target pests**: Caterpillars only
**Mode of action**: Bacterial toxin specific to lepidoptera larvae
**Strains**: Bt kurstaki for most caterpillars, Bt israelensis for mosquito larvae
**Application**: Spray on young caterpillars, timing is critical
**Safety**: Harmless to beneficial insects, humans, and pets

### Horticultural Oils
**Types**: Dormant oils (winter), summer oils (growing season)
**Effective against**: Scale insects, mites, aphids, overwintering eggs
**Mode of action**: Suffocation and disruption of feeding
**Application**: Thorough coverage required, avoid during hot weather

## Chapter 7: Seasonal Pest Management Calendar

### Spring (March-May)
**Tasks:**
- Remove overwintering pest habitat
- Install row covers on susceptible crops
- Set up yellow sticky traps
- Begin beneficial insect releases
- Start weekly monitoring routine

**Common Pests:** Aphids, flea beetles, cutworms
**Controls:** Row covers, beneficial releases, Bt for cutworms

### Summer (June-August)
**Tasks:**
- Maintain consistent monitoring
- Provide water for beneficial insects
- Hand-pick large pests daily
- Apply organic sprays as needed
- Keep beneficial plantings blooming

**Common Pests:** Spider mites, whiteflies, hornworms, squash bugs
**Controls:** Water sprays, neem oil, hand-picking, predator releases

### Fall (September-November)
**Tasks:**
- Clean up garden debris
- Plant cover crops
- Protect beneficial overwintering sites
- Order beneficial insects for next year
- Plan rotation strategies

**Common Pests:** Fall webworms, stink bugs, aphids
**Controls:** Removal of affected branches, soap sprays, beneficial conservation

### Winter (December-February)
**Tasks:**
- Plan next year's pest management strategy
- Order seeds for beneficial plants
- Study pest life cycles and timing
- Maintain beneficial insect habitat
- Prepare equipment and supplies

## Chapter 8: Troubleshooting Pest Problems

### When Controls Aren't Working
**Reassess identification**: Make sure you're targeting the right pest
**Check timing**: Some treatments are time-sensitive
**Evaluate coverage**: Ensure thorough application of treatments
**Consider environmental factors**: Stress makes plants more susceptible
**Look for beneficial insects**: They may be controlling the problem naturally

### Resistance Management
**Rotate control methods**: Don't rely on single approaches
**Use thresholds**: Don't treat unless necessary
**Preserve refugia**: Leave some untreated areas for beneficial insects
**Monitor effectiveness**: Track what works and what doesn't

### Working with Neighbors
Pest management works best on a community level:
- **Share knowledge** about effective techniques
- **Coordinate releases** of beneficial insects
- **Plan companion plantings** across property lines
- **Time treatments** to maximize effectiveness
- **Create pollinator corridors** through neighborhoods

## Emergency Protocols

### Severe Infestations
1. **Immediate assessment**: Identify pest and damage level
2. **Triage plants**: Save the healthiest, remove severely damaged
3. **Quick knockdown**: Use soap spray or strong water spray
4. **Follow-up treatment**: Apply appropriate organic control
5. **Monitor daily**: Track effectiveness and adjust as needed

### Disease Prevention
Many pests vector plant diseases:
- **Remove infected plants** immediately
- **Disinfect tools** between plants
- **Improve air circulation** to reduce humidity
- **Avoid overhead watering** when possible
- **Plant resistant varieties** when available

Remember: Successful organic pest control requires patience, observation, and persistence. Focus on building a healthy ecosystem rather than achieving perfect pest elimination. Your garden will become more resilient and self-regulating over time.
    `,
    features: [
      'Integrated Pest Management',
      'Beneficial Insect Guide',
      'Organic Spray Recipes',
      'Companion Planting',
      'Seasonal Pest Calendar',
      'Emergency Protocols'
    ],
    image: '/images/pest-control-guide.jpg',
    category: 'Pest Management',
    createdAt: '2024-02-01',
    updatedAt: '2024-08-20'
  }
];

/**
 * Get available resources
 */
export function getAvailableResources(): Resource[] {
  return AVAILABLE_RESOURCES;
}

/**
 * Get a specific resource by ID
 */
export function getResourceById(id: string): Resource | undefined {
  return AVAILABLE_RESOURCES.find(resource => resource.id === id);
}

/**
 * Enroll user in a resource (add to their collection)
 */
export async function enrollInResource(
  supabase: SupabaseClient,
  userId: string,
  resourceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if resource exists
    const resource = getResourceById(resourceId);
    if (!resource) {
      return { success: false, error: 'Resource not found' };
    }

    // Check if user is already enrolled
    const { data: existing } = await supabase
      .from('user_resources')
      .select('*')
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .single();

    if (existing) {
      return { success: false, error: 'Already enrolled in this resource' };
    }

    // Add enrollment record
    const { error } = await supabase
      .from('user_resources')
      .insert({
        user_id: userId,
        resource_id: resourceId,
        enrolled_at: new Date().toISOString(),
        progress: 0,
        completed: false
      });

    if (error) {
      console.error('Error enrolling in resource:', error);
      return { success: false, error: 'Failed to enroll in resource' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in enrollInResource:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Get user's enrolled resources
 */
export async function getUserResources(
  supabase: SupabaseClient,
  userId: string
): Promise<{ resources: Resource[]; userResources: UserResource[] }> {
  try {
    const { data: userResources, error } = await supabase
      .from('user_resources')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user resources:', error);
      return { resources: [], userResources: [] };
    }

    // Get the actual resource data for enrolled resources
    const enrolledResourceIds = userResources?.map(ur => ur.resource_id) || [];
    const resources = AVAILABLE_RESOURCES.filter(resource => 
      enrolledResourceIds.includes(resource.id)
    );

    return {
      resources,
      userResources: userResources?.map(ur => ({
        userId: ur.user_id,
        resourceId: ur.resource_id,
        enrolledAt: ur.enrolled_at,
        progress: ur.progress || 0,
        completed: ur.completed || false
      })) || []
    };
  } catch (error) {
    console.error('Error in getUserResources:', error);
    return { resources: [], userResources: [] };
  }
}

/**
 * Update user's progress in a resource
 */
export async function updateResourceProgress(
  supabase: SupabaseClient,
  userId: string,
  resourceId: string,
  progress: number,
  completed: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_resources')
      .update({
        progress: Math.max(0, Math.min(100, progress)),
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('resource_id', resourceId);

    if (error) {
      console.error('Error updating progress:', error);
      return { success: false, error: 'Failed to update progress' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateResourceProgress:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Remove resource from user's collection
 */
export async function unenrollFromResource(
  supabase: SupabaseClient,
  userId: string,
  resourceId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('user_resources')
      .delete()
      .eq('user_id', userId)
      .eq('resource_id', resourceId);

    if (error) {
      console.error('Error unenrolling from resource:', error);
      return { success: false, error: 'Failed to unenroll from resource' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in unenrollFromResource:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
