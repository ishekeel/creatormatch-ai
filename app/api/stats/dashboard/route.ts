export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';
import { calculateBrandToCreatorMatch, calculateCreatorToBrandMatch } from '@/lib/ai/matchingEngine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'brand';
    const id = searchParams.get('id');

    await dbEngine.ensureInitialized();

    if (role === 'brand') {
      const brandId = id || dbEngine.brandProfiles.all()[0]?.id;
      const brand = brandId ? (dbEngine.brandProfiles.findById(brandId) || dbEngine.brandProfiles.all()[0]) : null;
      if (!brand) {
        return NextResponse.json({
          success: true,
          role: 'brand',
          brand: null,
          stats: {
            totalCampaigns: 0,
            activeCampaignsCount: 0,
            pendingRequestsCount: 0,
            acceptedCollaborationsCount: 0,
            savedCreatorsCount: 0,
            averageMatchScore: 0,
            topMatchScore: 0,
          },
          topRecommendedCreators: [],
          recentCampaigns: [],
        });
      }

      const campaigns = dbEngine.campaigns.findByBrandId(brand.id);
      const activeCampaign = campaigns.find(c => c.status === 'active') || campaigns[0] || null;
      const creators = dbEngine.creatorProfiles.all();
      const collabs = dbEngine.collaborationRequests.findByBrandId(brand.id);
      const savedIds = dbEngine.savedItems.getSavedCreators(brand.id);

      // Compute top matches
      const matches = creators.map(c => ({
        creator: c,
        match: calculateBrandToCreatorMatch(brand, c, activeCampaign),
      })).sort((a, b) => b.match.overallScore - a.match.overallScore);

      const avgMatchScore = Math.round(
        matches.reduce((sum, m) => sum + m.match.overallScore, 0) / (matches.length || 1)
      );

      return NextResponse.json({
        success: true,
        role: 'brand',
        brand,
        stats: {
          totalCampaigns: campaigns.length,
          activeCampaignsCount: campaigns.filter(c => c.status === 'active').length,
          pendingRequestsCount: collabs.filter(c => c.status === 'pending').length,
          acceptedCollaborationsCount: collabs.filter(c => c.status === 'accepted').length,
          savedCreatorsCount: savedIds.length,
          averageMatchScore: avgMatchScore,
          topMatchScore: matches[0]?.match.overallScore || 0,
        },
        topRecommendedCreators: matches.slice(0, 4).map(m => ({
          creator: m.creator,
          matchScore: m.match.overallScore,
          verdict: m.match.recommendationVerdict,
          reasoning: m.match.summary,
        })),
        recentCampaigns: campaigns.slice(0, 3),
      });
    } else {
      const creatorId = id || dbEngine.creatorProfiles.all()[0]?.id;
      const creator = creatorId ? (dbEngine.creatorProfiles.findById(creatorId) || dbEngine.creatorProfiles.all()[0]) : null;
      if (!creator) {
        return NextResponse.json({
          success: true,
          role: 'creator',
          creator: null,
          stats: {
            appliedCampaignsCount: 0,
            acceptedPartnershipsCount: 0,
            connectedBrandsCount: 0,
            audienceReach: '0',
            creatorScore: 80,
            creatorCredits: 0,
          },
          topRecommendedBrands: [],
          myRecentApplications: [],
        });
      }

      const brands = dbEngine.brandProfiles.all();
      const allCampaigns = dbEngine.campaigns.all();
      const collabs = dbEngine.collaborationRequests.findByCreatorId(creator.id);
      const savedIds = dbEngine.savedItems.getSavedBrands(creator.id);

      const matches = brands.map(b => ({
        brand: b,
        match: calculateCreatorToBrandMatch(creator, b, allCampaigns),
      })).sort((a, b) => b.match.overallScore - a.match.overallScore);

      const avgMatchScore = Math.round(
        matches.reduce((sum, m) => sum + m.match.overallScore, 0) / (matches.length || 1)
      );

      return NextResponse.json({
        success: true,
        role: 'creator',
        creator,
        stats: {
          totalCollaborations: collabs.length,
          pendingInvitationsCount: collabs.filter(c => c.status === 'pending' && c.sender_role === 'brand').length,
          activeCollaborationsCount: collabs.filter(c => c.status === 'accepted').length,
          savedBrandsCount: savedIds.length,
          creatorCredits: creator.creator_credits,
          averageBrandMatchScore: avgMatchScore,
          topBrandMatchScore: matches[0]?.match.overallScore || 0,
        },
        topRecommendedBrands: matches.slice(0, 4).map(m => ({
          brand: m.brand,
          matchScore: m.match.overallScore,
          verdict: m.match.recommendationVerdict,
          reasoning: m.match.summary,
        })),
      });
    }
  } catch (error: any) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
