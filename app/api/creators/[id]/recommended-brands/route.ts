export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';
import { calculateCreatorToBrandMatch } from '@/lib/ai/matchingEngine';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creator = dbEngine.creatorProfiles.findById(params.id);
    if (!creator) {
      return NextResponse.json({ error: `Creator "${params.id}" not found in database.` }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const sortBy = searchParams.get('sortBy') || 'best_match';
    const search = searchParams.get('search');

    let brands = dbEngine.brandProfiles.all();
    const allCampaigns = dbEngine.campaigns.all();

    // Filters
    if (industry && industry !== 'All') {
      brands = brands.filter(b => b.industry.toLowerCase().includes(industry.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      brands = brands.filter(
        b =>
          b.brand_name.toLowerCase().includes(q) ||
          b.industry.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q)
      );
    }

    // Calculate dynamic Reverse AI match for THIS specific creator against each brand
    const rankedResults = brands.map(brand => {
      const brandCampaigns = allCampaigns.filter(c => c.brand_id === brand.id);
      const matchResult = calculateCreatorToBrandMatch(creator, brand, brandCampaigns);
      const activeCampaign = brandCampaigns.find(c => c.status === 'active') || brandCampaigns[0] || null;

      return {
        brand,
        activeCampaign,
        match: {
          creatorId: creator.id,
          brandId: brand.id,
          campaignId: activeCampaign?.id || null,
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
    if (sortBy === 'highest_budget') {
      // Sort by budget range
      rankedResults.sort((a, b) => b.brand.products.length - a.brand.products.length);
    } else {
      // Default: best_match
      rankedResults.sort((a, b) => b.match.overallScore - a.match.overallScore);
    }

    return NextResponse.json({
      success: true,
      creator: {
        id: creator.id,
        name: creator.creator_name,
        handle: creator.handle,
        niche: creator.niche,
        primary_sector_key: creator.primary_sector_key,
      },
      totalCount: rankedResults.length,
      recommendations: rankedResults,
    });
  } catch (error: any) {
    console.error('Recommended Brands API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
