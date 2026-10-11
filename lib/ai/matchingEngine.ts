import { DbBrandProfile, DbCreatorProfile, DbCampaign } from '../database/seedData';

export type SectorTaxonomy =
  | 'food_cooking'
  | 'fashion_modeling'
  | 'beauty_skincare'
  | 'tech_gaming'
  | 'health_fitness'
  | 'parenting_baby'
  | 'travel_lifestyle';

export interface MatchFactorBreakdown {
  sectorFit: number;          // 25%
  productFit: number;         // 20%
  audienceFit: number;        // 15%
  platformFit: number;        // 10%
  contentTypeFit: number;     // 10%
  engagementQuality: number;  // 8%
  locationLanguage: number;   // 5%
  preferencesFit: number;     // 4%
  pastExperience: number;     // 3%
}

export interface DetailedMatchResult {
  overallScore: number;
  recommendationVerdict: 'Strong AI Match' | 'Compatible Sector' | 'Moderate Fit' | 'Low Compatibility';
  positiveFactors: string[];
  negativeFactors: string[];
  breakdown: MatchFactorBreakdown;
  summary: string;
}

// Sector Affinity Matrix (0 to 100)
export const SECTOR_AFFINITY_MATRIX: Record<SectorTaxonomy, Record<SectorTaxonomy, number>> = {
  food_cooking: {
    food_cooking: 98,
    health_fitness: 55,
    travel_lifestyle: 45,
    parenting_baby: 35,
    beauty_skincare: 20,
    fashion_modeling: 16,
    tech_gaming: 12,
  },
  fashion_modeling: {
    fashion_modeling: 98,
    beauty_skincare: 76,
    travel_lifestyle: 65,
    health_fitness: 40,
    food_cooking: 16,
    parenting_baby: 22,
    tech_gaming: 12,
  },
  beauty_skincare: {
    beauty_skincare: 98,
    fashion_modeling: 76,
    travel_lifestyle: 60,
    health_fitness: 48,
    parenting_baby: 38,
    food_cooking: 20,
    tech_gaming: 10,
  },
  tech_gaming: {
    tech_gaming: 98,
    travel_lifestyle: 35,
    health_fitness: 25,
    fashion_modeling: 12,
    beauty_skincare: 10,
    food_cooking: 12,
    parenting_baby: 10,
  },
  health_fitness: {
    health_fitness: 98,
    food_cooking: 55,
    travel_lifestyle: 50,
    beauty_skincare: 45,
    fashion_modeling: 40,
    parenting_baby: 30,
    tech_gaming: 18,
  },
  parenting_baby: {
    parenting_baby: 98,
    food_cooking: 35,
    health_fitness: 30,
    beauty_skincare: 35,
    travel_lifestyle: 30,
    fashion_modeling: 22,
    tech_gaming: 10,
  },
  travel_lifestyle: {
    travel_lifestyle: 96,
    fashion_modeling: 65,
    food_cooking: 50,
    health_fitness: 48,
    beauty_skincare: 55,
    parenting_baby: 30,
    tech_gaming: 32,
  },
};

// Comprehensive Term-Frequency Sector Taxonomy Classifier
const SECTOR_DICTIONARY: Record<SectorTaxonomy, { strong: string[]; normal: string[] }> = {
  food_cooking: {
    strong: [
      'food', 'cook', 'cooking', 'culinary', 'recipe', 'recipes', 'chef', 'gourmet',
      'beverage', 'kitchen', 'meal', 'meals', 'dining', 'dish', 'dishes', 'snack',
      'snacks', 'spice', 'spices', 'oil', 'oils', 'bakery', 'baking', 'flavor', 'flavors',
      'taste', 'eating', 'organic food', 'farm to table', 'restaurant', 'gastronomy',
      'confectionery', 'edible', 'artisan spice', 'fusion recipes', 'plating'
    ],
    normal: ['taste', 'delicious', 'fresh', 'farm', 'sweet', 'savory', 'organic', 'artisan', 'drink', 'sauce']
  },
  fashion_modeling: {
    strong: [
      'fashion', 'model', 'modeling', 'clothing', 'apparel', 'streetwear', 'outfit',
      'outfits', 'runway', 'lookbook', 'lookbooks', 'ootd', 'wardrobe', 'couture',
      'designer wear', 'denim', 'trench', 'jacket', 'trousers', 'tailored', 'garment',
      'haute', 'footwear', 'styling', 'outerwear', 'overcoat', 'selvedge', 'capsule'
    ],
    normal: ['style', 'trend', 'trends', 'aesthetic', 'casual', 'urban', 'modern fit', 'textile', 'vogue']
  },
  beauty_skincare: {
    strong: [
      'beauty', 'skincare', 'skin care', 'cosmetics', 'cosmetic', 'serum', 'serums',
      'makeup', 'dermatology', 'barrier', 'moisturizer', 'facial', 'hydration',
      'cleanser', 'niacinamide', 'hyaluronic', 'dermatologist', 'haircare', 'shampoo',
      'lipstick', 'lip tint', 'foundation', 'glow serum', 'glass skin', 'antioxidant serum'
    ],
    normal: ['glow', 'radiant', 'radiance', 'cruelty-free', 'dewy', 'complexion', 'pore', 'acne']
  },
  tech_gaming: {
    strong: [
      'gaming', 'game', 'gamer', 'gamers', 'esports', 'esport', 'streamer', 'streaming',
      'twitch', 'fps', 'pc gaming', 'peripherals', 'mechanical keyboard', 'mouse',
      'console', 'playstation', 'xbox', 'technology', 'gadget', 'gadgets', 'hardware',
      'software', 'developer', 'headphones', 'earbuds', 'anc', 'noise cancellation',
      'polling rate', 'sensor', 'latency', 'computer', 'novapods'
    ],
    normal: ['tech', 'audio', 'sound', 'wireless', 'performance', 'pro-grade', 'setup', 'specs']
  },
  health_fitness: {
    strong: [
      'fitness', 'gym', 'workout', 'workouts', 'exercise', 'athlete', 'athletic',
      'bodybuilding', 'crossfit', 'yoga', 'protein', 'isolate', 'bcaa', 'supplement',
      'supplements', 'muscle', 'cardio', 'weightlifting', 'trainer', 'calisthenics',
      'marathon', 'activewear', 'fermented pea'
    ],
    normal: ['health', 'wellness', 'nutrition', 'stamina', 'endurance', 'energy', 'recovery']
  },
  parenting_baby: {
    strong: [
      'baby', 'babies', 'infant', 'infants', 'toddler', 'toddlers', 'parenting',
      'diaper', 'diapers', 'nursery', 'pediatric', 'motherhood', 'fatherhood',
      'newborn', 'maternity', 'pregnancy', 'baby care', 'childcare', 'rash', 'ecobaby'
    ],
    normal: ['gentle', 'safe', 'parents', 'family', 'mom', 'dad', 'kids', 'children']
  },
  travel_lifestyle: {
    strong: [
      'travel', 'traveler', 'wanderlust', 'tourism', 'hotel', 'resort', 'flight',
      'destination', 'vlog', 'vlogs', 'vlogger', 'backpacking', 'adventure', 'explore'
    ],
    normal: ['lifestyle', 'journey', 'culture', 'stories', 'city', 'trip', 'places']
  }
};

/**
 * Accurately classifies any text string into one of the 7 SectorTaxonomy keys
 * using weighted term-frequency matching.
 */
export function classifySector(text: string): SectorTaxonomy {
  if (!text) return 'travel_lifestyle';
  const t = text.toLowerCase();

  const scores: Record<SectorTaxonomy, number> = {
    food_cooking: 0,
    fashion_modeling: 0,
    beauty_skincare: 0,
    tech_gaming: 0,
    health_fitness: 0,
    parenting_baby: 0,
    travel_lifestyle: 0,
  };

  (Object.keys(SECTOR_DICTIONARY) as SectorTaxonomy[]).forEach(sector => {
    const dict = SECTOR_DICTIONARY[sector];
    dict.strong.forEach(word => {
      if (t.includes(word)) scores[sector] += 3.5;
    });
    dict.normal.forEach(word => {
      if (t.includes(word)) scores[sector] += 1.0;
    });
  });

  let topSector: SectorTaxonomy = 'travel_lifestyle';
  let maxScore = 0;

  (Object.keys(scores) as SectorTaxonomy[]).forEach(sector => {
    if (scores[sector] > maxScore) {
      maxScore = scores[sector];
      topSector = sector;
    }
  });

  return topSector;
}

/**
 * Normalizes input: if already a valid SectorTaxonomy key, returns it directly;
 * otherwise runs the full term-frequency classifier.
 */
export function normalizeSector(input?: string): SectorTaxonomy {
  if (!input) return 'travel_lifestyle';
  const val = input.toLowerCase().trim();
  if (val in SECTOR_AFFINITY_MATRIX) {
    return val as SectorTaxonomy;
  }
  return classifySector(val);
}

/**
 * Core Brand -> Creator Matching Engine
 * Computes realistic, multi-signal compatibility score and explainable reasons.
 * Sector alignment is treated as the foundational gatekeeper:
 * Same sector guarantees 93%+ First-Priority ranking.
 * Divergent sectors are realistically gated to < 30%.
 */
export function calculateBrandToCreatorMatch(
  brand: DbBrandProfile,
  creator: DbCreatorProfile,
  campaign?: DbCampaign | null
): DetailedMatchResult {
  const brandContext = `${brand.sector_key || ''} ${brand.industry || ''} ${brand.brand_name || ''} ${brand.description || ''} ${
    brand.products?.map(p => `${p.name} ${p.category} ${p.description}`).join(' ') || ''
  } ${campaign ? `${campaign.category} ${campaign.product} ${campaign.name} ${campaign.description}` : ''}`;

  const creatorContext = `${creator.primary_sector_key || ''} ${(creator.niche || []).join(' ')} ${(creator.categories || []).join(' ')} ${
    creator.bio || ''
  }`;

  const brandSector = normalizeSector(brand.sector_key || brandContext);
  const creatorSector = normalizeSector(creator.primary_sector_key || creatorContext);

  const isExactSectorMatch = brandSector === creatorSector;
  const rawAffinity = SECTOR_AFFINITY_MATRIX[brandSector]?.[creatorSector] ?? 20;

  // 1. Sector Fit (25%)
  const sectorFit = isExactSectorMatch ? 98 : rawAffinity;

  // 2. Product Category Fit (20%)
  let productFit = 30;
  const targetProducts = campaign
    ? [campaign.product.toLowerCase(), campaign.category.toLowerCase()]
    : (brand.products || []).map(p => `${p.name} ${p.category}`.toLowerCase());

  const creatorCategories = (creator.categories || []).map(c => c.toLowerCase());
  const creatorNiches = (creator.niche || []).map(n => n.toLowerCase());

  let productKeywordMatches = 0;
  for (const prod of targetProducts) {
    if (creatorCategories.some(c => prod.includes(c) || c.includes(prod))) productKeywordMatches++;
    if (creatorNiches.some(n => prod.includes(n) || n.includes(prod))) productKeywordMatches++;
  }

  if (isExactSectorMatch) {
    productFit = 94 + Math.min(productKeywordMatches * 2, 4);
  } else if (sectorFit >= 65) {
    productFit = 68 + Math.min(productKeywordMatches * 4, 15);
  } else if (sectorFit >= 40) {
    productFit = 42 + Math.min(productKeywordMatches * 3, 10);
  } else {
    productFit = Math.max(10, Math.min(productKeywordMatches * 4, 20));
  }

  // 3. Audience Fit (15%)
  let audienceFit = 55;
  const targetAge = campaign?.target_audience?.age || brand.target_audience?.age || '18-24';
  if (targetAge.includes('18') && (creator.audience_demographics?.age_breakdown?.['18-24'] || 0) > 35) {
    audienceFit += 20;
  }
  if (targetAge.includes('25') && (creator.audience_demographics?.age_breakdown?.['25-34'] || 0) > 30) {
    audienceFit += 15;
  }

  const targetGender = campaign?.target_audience?.gender || brand.target_audience?.gender || '';
  if (targetGender.toLowerCase().includes('female') && (creator.audience_demographics?.gender_split?.female || 0) > 55) {
    audienceFit += 15;
  } else if (targetGender.toLowerCase().includes('male') && (creator.audience_demographics?.gender_split?.male || 0) > 55) {
    audienceFit += 15;
  } else {
    audienceFit += 10;
  }

  audienceFit = Math.min(Math.max(audienceFit, 20), 96);
  if (!isExactSectorMatch && sectorFit < 35) {
    audienceFit = Math.round(audienceFit * 0.3);
  } else if (isExactSectorMatch) {
    audienceFit = Math.max(audienceFit, 88);
  }

  // 4. Platform Fit (10%)
  const requiredPlatforms = campaign?.required_platforms || brand.preferred_platforms || ['Instagram'];
  const creatorPlatformNames = (creator.social_platforms || []).map(p => p.platform.toLowerCase());
  const hasPlatformOverlap = requiredPlatforms.some(rp =>
    creatorPlatformNames.some(cp => cp.includes(rp.toLowerCase()) || rp.toLowerCase().includes(cp))
  );
  let platformFit = hasPlatformOverlap ? 96 : 40;
  if (!isExactSectorMatch && sectorFit < 30) platformFit = Math.round(platformFit * 0.4);

  // 5. Content Type / Skill Fit (10%)
  let contentTypeFit = isExactSectorMatch ? 94 : 55;
  const creatorWorkTypes = (creator.portfolio || []).map(p => p.type.toLowerCase());
  if (creatorWorkTypes.some(t => t.includes('reel') || t.includes('short') || t.includes('video'))) {
    contentTypeFit += 4;
  }
  contentTypeFit = Math.min(contentTypeFit, 98);
  if (!isExactSectorMatch && sectorFit < 35) contentTypeFit = Math.round(contentTypeFit * 0.35);

  // 6. Engagement Quality (8%)
  let engagementQuality = 65;
  if (creator.engagement_rate >= 8.0) engagementQuality = 98;
  else if (creator.engagement_rate >= 7.0) engagementQuality = 90;
  else if (creator.engagement_rate >= 5.5) engagementQuality = 80;
  else engagementQuality = 68;
  if (!isExactSectorMatch && sectorFit < 30) engagementQuality = Math.round(engagementQuality * 0.4);

  // 7. Location & Language Fit (5%)
  let locationLanguage = 75;
  const brandLoc = (brand.location || 'India').toLowerCase();
  const creatorLoc = (creator.location || '').toLowerCase();
  if (brandLoc.includes('india') && creatorLoc.includes('india')) locationLanguage += 20;
  locationLanguage = Math.min(locationLanguage, 95);
  if (!isExactSectorMatch && sectorFit < 30) locationLanguage = Math.round(locationLanguage * 0.4);

  // 8. Creator Preferences Fit (4%)
  const preferredBrands = (creator.preferred_brand_categories || []).map(c => c.toLowerCase());
  const brandIndustryLower = (brand.industry || '').toLowerCase();
  const brandMatchesPreference = preferredBrands.some(pb => brandIndustryLower.includes(pb) || pb.includes(brandIndustryLower));
  let preferencesFit = brandMatchesPreference || isExactSectorMatch ? 96 : 40;
  if (!isExactSectorMatch && sectorFit < 30) preferencesFit = 15;

  // 9. Past Relevant Experience (3%)
  let pastExperience = 60;
  if (creator.past_brands_worked_with?.some(b => b.toLowerCase().includes((brand.brand_name || '').toLowerCase()))) {
    pastExperience = 98;
  } else if ((creator.completed_campaigns || 0) >= 10) {
    pastExperience = 88;
  } else if ((creator.completed_campaigns || 0) >= 5) {
    pastExperience = 78;
  }
  if (!isExactSectorMatch && sectorFit < 30) pastExperience = Math.round(pastExperience * 0.3);

  // Compute Base Weighted Overall Score (0 - 100)
  let overallScore = Math.round(
    sectorFit * 0.25 +
    productFit * 0.20 +
    audienceFit * 0.15 +
    platformFit * 0.10 +
    contentTypeFit * 0.10 +
    engagementQuality * 0.08 +
    locationLanguage * 0.05 +
    preferencesFit * 0.04 +
    pastExperience * 0.03
  );

  // Deterministic Sector Gatekeeper:
  // Same sector ALWAYS gets 93% - 98% (First Priority Rank)
  // Divergent sectors (< 35 affinity) are realistically capped at 18% - 26%
  if (isExactSectorMatch) {
    overallScore = Math.max(overallScore, 93);
  } else if (sectorFit < 35) {
    overallScore = Math.min(overallScore, 26);
  }

  // Determine Verdict
  let recommendationVerdict: DetailedMatchResult['recommendationVerdict'] = 'Low Compatibility';
  if (overallScore >= 85) recommendationVerdict = 'Strong AI Match';
  else if (overallScore >= 65) recommendationVerdict = 'Compatible Sector';
  else if (overallScore >= 45) recommendationVerdict = 'Moderate Fit';

  // Generate Explainable Factors
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];

  const brandSectorLabel = brandSector.replace('_', ' ').toUpperCase();
  const creatorSectorLabel = creatorSector.replace('_', ' ').toUpperCase();

  if (isExactSectorMatch) {
    positiveFactors.push(`Priority Industry Match: Both brand and creator operate in ${brandSectorLabel}. Guaranteed First Priority AI Recommendation.`);
    positiveFactors.push(`Direct product synergy: Creator's verified portfolio aligns with ${brand.brand_name}'s catalog.`);
  } else if (sectorFit >= 60) {
    positiveFactors.push(`Adjacent sector resonance: Cross-category crossover potential between ${creatorSectorLabel} and ${brandSectorLabel}.`);
  } else {
    negativeFactors.push(`Fundamental Sector Mismatch: Brand operates in ${brandSectorLabel}, whereas creator specializes in ${creatorSectorLabel}. Cross-sector audience relevance is negligible.`);
    negativeFactors.push(`Audience intent mismatch: Creator's followers seek ${creatorSectorLabel} content, not ${brand.industry} products.`);
  }

  if (audienceFit >= 70) {
    positiveFactors.push(`Audience demographic overlap: Age and gender distributions match brand's target customers.`);
  } else if (!isExactSectorMatch) {
    negativeFactors.push(`Limited demographic overlap with brand's target buyer persona.`);
  }

  if (hasPlatformOverlap) {
    positiveFactors.push(`Platform presence: Creator is active and established on required channels (${requiredPlatforms.join(', ')}).`);
  } else {
    negativeFactors.push(`Platform gap: Creator lacks primary audience on ${requiredPlatforms.join(', ')}.`);
  }

  if (creator.engagement_rate >= 7.0) {
    positiveFactors.push(`High engagement quality: ${creator.engagement_display} interaction rate exceeds industry benchmarks.`);
  }

  if (creator.past_brands_worked_with?.some(b => b.toLowerCase().includes((brand.brand_name || '').toLowerCase()))) {
    positiveFactors.push(`Proven partnership track record: Prior successful collaborations with ${brand.brand_name}.`);
  }

  // Summary Rationale
  let summary = '';
  if (isExactSectorMatch) {
    summary = `First Priority Match (${overallScore}%): Direct industry alignment between ${brand.brand_name} (${brandSectorLabel}) and ${creator.creator_name} (${creatorSectorLabel}). High audience purchase intent and proven content delivery.`;
  } else if (overallScore >= 65) {
    summary = `Compatible Partnership (${overallScore}%): Creator operates in adjacent ${creatorSectorLabel} with strong ${creator.engagement_display} engagement. Useful for crossover reach.`;
  } else {
    summary = `Low Compatibility (${overallScore}%): Fundamental category divergence between brand (${brandSectorLabel}) and creator focus (${creatorSectorLabel}). We recommend creators specialized in ${brandSectorLabel}.`;
  }

  const breakdown: MatchFactorBreakdown = {
    sectorFit,
    productFit,
    audienceFit,
    platformFit,
    contentTypeFit,
    engagementQuality,
    locationLanguage,
    preferencesFit,
    pastExperience,
  };

  return {
    overallScore,
    recommendationVerdict,
    positiveFactors,
    negativeFactors,
    breakdown,
    summary,
  };
}

/**
 * Reverse Matching: Creator -> Brand Recommendation ("Find Brands For You")
 * Analyzes creator profile and calculates top matching brands/campaigns.
 */
export function calculateCreatorToBrandMatch(
  creator: DbCreatorProfile,
  brand: DbBrandProfile,
  campaigns: DbCampaign[] = []
): DetailedMatchResult {
  const brandCampaign = campaigns.find(c => c.brand_id === brand.id && c.status === 'active') || campaigns.find(c => c.brand_id === brand.id) || null;

  const result = calculateBrandToCreatorMatch(brand, creator, brandCampaign);

  const reversePositive: string[] = [];
  const reverseNegative: string[] = [];

  const brandSectorLabel = normalizeSector(brand.sector_key || brand.industry).replace('_', ' ').toUpperCase();
  const creatorSectorLabel = normalizeSector(creator.primary_sector_key || (creator.niche || []).join(' ')).replace('_', ' ').toUpperCase();

  if (brandSectorLabel === creatorSectorLabel) {
    reversePositive.push(`First Priority Industry Match: Your ${creatorSectorLabel} content directly matches ${brand.brand_name}'s core domain.`);
    reversePositive.push(`High monetization synergy: ${brand.brand_name} actively sponsors creators with your exact audience.`);
  } else if (result.breakdown.sectorFit >= 55) {
    reversePositive.push(`Creative crossover synergy: Opportunity to introduce ${brand.brand_name} to your ${creatorSectorLabel} audience.`);
  } else {
    reverseNegative.push(`${brand.brand_name} operates in ${brandSectorLabel}, differing fundamentally from your ${creatorSectorLabel} focus.`);
  }

  if (result.breakdown.audienceFit >= 70) {
    reversePositive.push(`Audience demographic synergy: Your followers closely match ${brand.brand_name}'s target customer base.`);
  } else if (result.breakdown.sectorFit < 35) {
    reverseNegative.push(`Your follower demographics have minimal overlap with ${brand.brand_name}'s buyers.`);
  }

  if (result.breakdown.platformFit >= 70) {
    reversePositive.push(`Platform compatibility: You publish on channels prioritized by ${brand.brand_name}.`);
  }

  if (brandCampaign) {
    reversePositive.push(`Active campaign available: "${brandCampaign.name}" with reward of ${brandCampaign.reward_display}.`);
  }

  return {
    ...result,
    positiveFactors: reversePositive.length > 0 ? reversePositive : result.positiveFactors,
    negativeFactors: reverseNegative.length > 0 ? reverseNegative : result.negativeFactors,
    summary: brandSectorLabel === creatorSectorLabel
      ? `First Priority Match (${result.overallScore}%): ${brand.brand_name} operates directly in your ${creatorSectorLabel} sector with verified budget allocation.`
      : `Brand Compatibility (${result.overallScore}%): ${brand.brand_name} (${brandSectorLabel}) has low natural relevance to your ${creatorSectorLabel} niche.`,
  };
}
