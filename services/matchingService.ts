import { Campaign, Creator, Brand, MatchScore, MatchBreakdown } from '@/types';
import {
  calculateBrandToCreatorMatch,
  calculateCreatorToBrandMatch,
  DetailedMatchResult,
  classifySector,
  normalizeSector,
} from '@/lib/ai/matchingEngine';
import { DbBrandProfile, DbCreatorProfile, DbCampaign } from '@/lib/database/seedData';

// Helper to adapt frontend Brand/Campaign/Creator to DB model structure if needed
function adaptBrandToDb(brand: Brand): DbBrandProfile {
  return {
    id: brand?.id || '',
    user_id: `user-${brand?.id || 'brand'}`,
    brand_name: brand?.name || 'Brand',
    logo: brand?.logo || '',
    description: brand?.description || '',
    industry: brand?.industry || 'General',
    sector_key: classifySector(`${brand?.industry || ''} ${brand?.name || ''} ${brand?.description || ''} ${(brand?.products || []).map(p => `${p.name} ${p.category}`).join(' ')}`),
    location: brand?.location || '',
    operating_duration: brand?.operatingDuration || '1 Year',
    established_year: brand?.establishedYear || '2024',
    website: brand?.website || '',
    products: brand?.products || [],
    target_audience: {
      age: '18-34',
      gender: 'All',
      location: brand?.location || 'India',
      interests: [],
      description: brand?.targetAudience || '',
    },
    preferred_platforms: ['Instagram', 'YouTube'],
    preferred_creator_categories: [],
    budget_range: '₹50,000 - ₹2,00,000',
    stats: {
      active_campaigns: brand?.stats?.activeCampaigns || 0,
      creators_collaborating: brand?.stats?.creatorsCollaborating || 0,
      total_reach: brand?.stats?.totalReach || '0',
      avg_engagement: brand?.stats?.avgEngagement || '0%',
      conversions: brand?.stats?.conversions || 0,
      roi: brand?.stats?.roi || '0x',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function adaptCampaignToDb(campaign: Campaign): DbCampaign {
  return {
    id: campaign?.id || '',
    brand_id: campaign?.brandId || '',
    brand_name: campaign?.brandName || '',
    brand_logo: campaign?.brandLogo || '',
    name: campaign?.name || '',
    product: campaign?.product || '',
    category: campaign?.category || '',
    sector_key: classifySector(`${campaign?.category || ''} ${campaign?.product || ''} ${campaign?.name || ''} ${campaign?.description || ''}`),
    description: campaign?.description || '',
    product_image: campaign?.productImage || '',
    objective: campaign?.objective || '',
    target_audience: {
      age: campaign?.targetAudience?.age || '18-24',
      gender: campaign?.targetAudience?.gender || 'All',
      location: campaign?.targetAudience?.location || 'India',
      language: campaign?.targetAudience?.language || 'English',
      interests: campaign?.targetAudience?.interests || [],
    },
    required_platforms: ['Instagram', 'YouTube'],
    deliverables: campaign?.deliverables || [],
    guidelines: campaign?.guidelines,
    timeline: {
      startDate: campaign?.timeline?.startDate || '',
      endDate: campaign?.timeline?.endDate || '',
      submissionDeadline: campaign?.timeline?.submissionDeadline || '',
    },
    budget: campaign?.budget || 50000,
    reward_display: campaign?.rewardDisplay || '₹50,000',
    deadline_display: campaign?.deadlineDisplay || '',
    invited_creator_ids: campaign?.invitedCreatorIds || [],
    accepted_creator_ids: campaign?.acceptedCreatorIds || [],
    applied_creator_ids: campaign?.appliedCreatorIds || [],
    status: campaign?.status || 'active',
    reach: campaign?.reach || '0',
    engagement: campaign?.engagement || '0%',
    conversions: campaign?.conversions || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function adaptCreatorToDb(creator: Creator): DbCreatorProfile {
  return {
    id: creator?.id || '',
    user_id: `user-${creator?.id || 'creator'}`,
    creator_name: creator?.name || 'Creator',
    handle: (creator?.handle || 'creator').replace('@', ''),
    avatar: creator?.avatar || '',
    email: creator?.email || `${creator?.id || 'creator'}@example.com`,
    bio: creator?.bio || '',
    niche: creator?.niche || [],
    primary_sector_key: classifySector(`${(creator?.niche || []).join(' ')} ${(creator?.categories || []).join(' ')} ${creator?.bio || ''}`),
    categories: creator?.categories || [],
    content_types: ['Reels', 'Shorts'],
    location: creator?.location || '',
    languages: creator?.languages || ['English'],
    social_platforms: (creator?.socialPlatforms || []).map(sp => ({
      platform: sp.platform,
      handle: sp.handle,
      url: sp.url,
      followers: sp.followers,
      engagement: sp.engagement,
    })),
    followers: creator?.followers || 0,
    followers_display: creator?.followersDisplay || '0',
    avg_views: creator?.avgViews || '0',
    engagement_rate: creator?.engagementRate || 0,
    engagement_display: creator?.engagementDisplay || '0%',
    creator_score: creator?.creatorScore || 80,
    creator_credits: creator?.creatorCredits || 0,
    campaign_wins: creator?.campaignWins || 0,
    completed_campaigns: creator?.completedCampaigns || 0,
    total_reach: creator?.totalReach || '0',
    verified: creator?.verified || false,
    audience_demographics: {
      age_breakdown: creator?.audience?.ageBreakdown || {},
      gender_split: creator?.audience?.genderSplit || { female: 50, male: 50, other: 0 },
      top_locations: creator?.audience?.topLocations || [],
      top_interests: creator?.audience?.topInterests || [],
    },
    portfolio: (creator.portfolio || []).map(p => ({
      id: p.id,
      title: p.title,
      type: (p.type as any) || 'reel',
      url: p.url,
      thumbnail: p.thumbnail,
      views: p.views,
      engagement: p.engagement,
      brand_name: p.brandName,
      featured: p.featured,
    })),
    skills: ['Video Production', 'Authentic Voiceover'],
    past_brands_worked_with: creator.pastBrandsWorkedWith || [],
    preferred_brand_categories: [],
    collaboration_preferences: { min_budget: 50000, preferred_deliverables: [], open_to_gifting: true },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function mapDetailedResultToMatchScore(creatorId: string, result: DetailedMatchResult, brandId?: string): MatchScore {
  const breakdown: MatchBreakdown = {
    sectorFitScore: result.breakdown.sectorFit,
    skillFitScore: result.breakdown.contentTypeFit,
    nicheMatch: result.breakdown.sectorFit,
    audienceMatch: result.breakdown.audienceFit,
    engagementQuality: result.breakdown.engagementQuality,
    locationLanguageMatch: result.breakdown.locationLanguage,
    campaignFit: Math.round((result.breakdown.sectorFit + result.breakdown.productFit) / 2),
    pastPerformance: result.breakdown.pastExperience,
  };

  return {
    creatorId,
    brandId,
    overallScore: result.overallScore,
    sectorFitScore: result.breakdown.sectorFit,
    skillFitScore: result.breakdown.contentTypeFit,
    recommendationVerdict: result.recommendationVerdict,
    aiReasoning: result.summary,
    positiveFactors: result.positiveFactors,
    negativeFactors: result.negativeFactors,
    breakdown,
    explanation: result.summary,
  };
}

/**
 * Calculates match score between Campaign and Creator
 */
export function calculateMatchScore(campaign: Campaign, creator: Creator): MatchScore {
  const dbCampaign = adaptCampaignToDb(campaign);
  const dbBrand: DbBrandProfile = {
    id: campaign.brandId,
    user_id: `user-${campaign.brandId}`,
    brand_name: campaign.brandName,
    logo: campaign.brandLogo,
    description: campaign.description,
    industry: campaign.category,
    sector_key: campaign.category.toLowerCase(),
    location: campaign.targetAudience?.location || 'India',
    operating_duration: '3 Years',
    established_year: '2022',
    website: '',
    products: [{ id: 'p1', name: campaign.product, description: campaign.product, category: campaign.category, image: campaign.productImage }],
    target_audience: {
      age: campaign.targetAudience?.age || '18-24',
      gender: campaign.targetAudience?.gender || 'All',
      location: campaign.targetAudience?.location || 'India',
      interests: campaign.targetAudience?.interests || [],
      description: campaign.description,
    },
    preferred_platforms: campaign.requirements?.platforms || ['Instagram', 'YouTube'],
    preferred_creator_categories: [],
    budget_range: campaign.rewardDisplay,
    stats: { active_campaigns: 1, creators_collaborating: 5, total_reach: '1M', avg_engagement: '6%', conversions: 2000, roi: '4x' },
    created_at: '',
    updated_at: '',
  };
  const dbCreator = adaptCreatorToDb(creator);

  const result = calculateBrandToCreatorMatch(dbBrand, dbCreator, dbCampaign);
  return mapDetailedResultToMatchScore(creator.id, result, campaign.brandId);
}

/**
 * Calculates match score between Brand and Creator directly
 */
export function calculateBrandCreatorMatch(
  brand: Brand | DbBrandProfile,
  creator: Creator | DbCreatorProfile,
  campaign?: Campaign | DbCampaign | null
): MatchScore {
  const dbBrand = 'stats' in brand && 'active_campaigns' in brand.stats ? (brand as DbBrandProfile) : adaptBrandToDb(brand as Brand);
  const dbCreator = 'creator_name' in creator ? (creator as DbCreatorProfile) : adaptCreatorToDb(creator as Creator);
  const dbCampaign = campaign ? ('brand_logo' in campaign && 'reward_display' in campaign ? (campaign as DbCampaign) : adaptCampaignToDb(campaign as Campaign)) : null;

  const result = calculateBrandToCreatorMatch(dbBrand, dbCreator, dbCampaign);
  return mapDetailedResultToMatchScore(dbCreator.id, result, dbBrand.id);
}

/**
 * Reverse Matching: Creator -> Brand Recommendation ("Find Brands For You")
 */
export function calculateCreatorBrandMatch(
  creator: Creator | DbCreatorProfile,
  brand: Brand | DbBrandProfile,
  campaigns: (Campaign | DbCampaign)[] = []
): MatchScore {
  const dbCreator = 'creator_name' in creator ? (creator as DbCreatorProfile) : adaptCreatorToDb(creator as Creator);
  const dbBrand = 'stats' in brand && 'active_campaigns' in brand.stats ? (brand as DbBrandProfile) : adaptBrandToDb(brand as Brand);
  const dbCampaigns = campaigns.map(c => ('reward_display' in c ? (c as DbCampaign) : adaptCampaignToDb(c as Campaign)));

  const result = calculateCreatorToBrandMatch(dbCreator, dbBrand, dbCampaigns);
  return mapDetailedResultToMatchScore(dbCreator.id, result, dbBrand.id);
}

/**
 * Matches all creators against a campaign and sorts descending by AI match score
 */
export function matchCreators(campaign: Campaign, creators: Creator[]): { creator: Creator; match: MatchScore }[] {
  return creators
    .map(creator => ({
      creator,
      match: calculateMatchScore(campaign, creator),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}

/**
 * Matches all creators against a brand profile and sorts descending by AI match score
 */
export function matchCreatorsForBrand(
  brand: Brand,
  creators: Creator[],
  campaign?: Campaign | null
): { creator: Creator; match: MatchScore }[] {
  return creators
    .map(creator => ({
      creator,
      match: calculateBrandCreatorMatch(brand, creator, campaign),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}

/**
 * Reverse Recommendation: Matches all brands against a creator and sorts descending
 */
export function matchBrandsForCreator(
  creator: Creator,
  brands: Brand[],
  campaigns: Campaign[] = []
): { brand: Brand; match: MatchScore }[] {
  return brands
    .map(brand => ({
      brand,
      match: calculateCreatorBrandMatch(creator, brand, campaigns),
    }))
    .sort((a, b) => b.match.overallScore - a.match.overallScore);
}
