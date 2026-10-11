export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';
import { calculateBrandToCreatorMatch } from '@/lib/ai/matchingEngine';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brand = dbEngine.brandProfiles.findById(params.id);
    if (!brand) {
      return NextResponse.json({ error: `Brand "${params.id}" not found in database.` }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    const category = searchParams.get('category');
    const platform = searchParams.get('platform');
    const minFollowers = searchParams.get('minFollowers') ? parseInt(searchParams.get('minFollowers')!, 10) : 0;
    const minEngagement = searchParams.get('minEngagement') ? parseFloat(searchParams.get('minEngagement')!) : 0;
    const sortBy = searchParams.get('sortBy') || 'best_match';
    const search = searchParams.get('search');

    // Find campaign if specified or take brand's first active campaign
    let campaign = campaignId ? dbEngine.campaigns.findById(campaignId) : null;
    if (!campaign) {
      const brandCampaigns = dbEngine.campaigns.findByBrandId(brand.id);
      campaign = brandCampaigns.find(c => c.status === 'active') || brandCampaigns[0] || null;
    }

    // Retrieve all creators from database
    let creators = dbEngine.creatorProfiles.all();

    // Filters
    if (category && category !== 'All') {
      creators = creators.filter(c =>
        c.niche.some(n => n.toLowerCase().includes(category.toLowerCase())) ||
        c.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
      );
    }

    if (platform && platform !== 'All') {
      creators = creators.filter(c =>
        c.social_platforms.some(sp => sp.platform.toLowerCase() === platform.toLowerCase())
      );
    }

    if (minFollowers > 0) {
      creators = creators.filter(c => c.followers >= minFollowers);
    }

    if (minEngagement > 0) {
      creators = creators.filter(c => c.engagement_rate >= minEngagement);
    }

    if (search) {
      const q = search.toLowerCase();
      creators = creators.filter(
        c =>
          c.creator_name.toLowerCase().includes(q) ||
          c.handle.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.niche.some(n => n.toLowerCase().includes(q))
      );
    }

    // Calculate dynamic AI match for each creator against THIS specific brand / campaign
    const rankedResults = creators.map(creator => {
      const matchResult = calculateBrandToCreatorMatch(brand, creator, campaign);
      return {
        creator,
        match: {
          creatorId: creator.id,
          brandId: brand.id,
          campaignId: campaign?.id || null,
          overallScore: matchResult.overallScore,
          recommendationVerdict: matchResult.recommendationVerdict,
          positiveFactors: matchResult.positiveFactors,
          negativeFactors: matchResult.negativeFactors,
          breakdown: matchResult.breakdown,
          aiReasoning: matchResult.summary,
          explanation: matchResult.summary,
        },
      };
    });

    // Apply sorting
    if (sortBy === 'highest_engagement') {
      rankedResults.sort((a, b) => b.creator.engagement_rate - a.creator.engagement_rate);
    } else if (sortBy === 'followers') {
      rankedResults.sort((a, b) => b.creator.followers - a.creator.followers);
    } else if (sortBy === 'creator_score') {
      rankedResults.sort((a, b) => b.creator.creator_score - a.creator.creator_score);
    } else {
      // Default: best_match
      rankedResults.sort((a, b) => b.match.overallScore - a.match.overallScore);
    }

    return NextResponse.json({
      success: true,
      brand: {
        id: brand.id,
        name: brand.brand_name,
        industry: brand.industry,
        sector_key: brand.sector_key,
      },
      campaignContext: campaign
        ? {
            id: campaign.id,
            name: campaign.name,
            product: campaign.product,
            category: campaign.category,
          }
        : null,
      totalCount: rankedResults.length,
      recommendations: rankedResults,
    });
  } catch (error: any) {
    console.error('Recommended Creators API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
