import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role, name, profileData } = body;

    if (!email || !role || !name) {
      return NextResponse.json(
        { error: 'Missing required registration fields (email, name, role)' },
        { status: 400 }
      );
    }

    await dbEngine.ensureInitialized();

    // Check for existing user
    const existing = dbEngine.users.findByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const userId = `user-${role}-${Date.now()}`;
    const user = await dbEngine.users.create({
      id: userId,
      email,
      password_hash: password || 'default_hashed_pass',
      role,
      name,
      avatar: profileData?.avatar || (role === 'brand'
        ? 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'),
    });

    let createdProfile: any = null;

    if (role === 'brand') {
      const brandId = `brand-${Date.now()}`;
      createdProfile = await dbEngine.brandProfiles.create({
        id: brandId,
        user_id: user.id,
        brand_name: name,
        logo: user.avatar,
        description: profileData?.description || 'Authentic creator-friendly brand partnering with emerging talent.',
        industry: profileData?.industry || 'Fashion & Apparel',
        sector_key: (profileData?.industry || 'fashion').toLowerCase(),
        location: profileData?.location || 'India',
        operating_duration: profileData?.operatingDuration || '1 Year',
        established_year: profileData?.establishedYear || new Date().getFullYear().toString(),
        website: profileData?.website || '',
        products: profileData?.products || [],
        target_audience: {
          age: profileData?.targetAudienceAge || '18-34',
          gender: 'All',
          location: profileData?.location || 'India',
          interests: [],
          description: profileData?.targetAudience || 'Modern trendsetters and conscious consumers.',
        },
        preferred_platforms: profileData?.preferredPlatforms || ['Instagram', 'YouTube'],
        preferred_creator_categories: profileData?.preferredCategories || [],
        budget_range: profileData?.budgetRange || '₹50,000 - ₹2,00,000',
        stats: {
          active_campaigns: 1,
          creators_collaborating: 0,
          total_reach: '0K',
          avg_engagement: '0%',
          conversions: 0,
          roi: '0x',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      const creatorId = `creator-${Date.now()}`;
      createdProfile = await dbEngine.creatorProfiles.create({
        id: creatorId,
        user_id: user.id,
        creator_name: name,
        handle: profileData?.handle ? profileData.handle.replace('@', '') : name.toLowerCase().replace(/\s+/g, '_'),
        avatar: user.avatar,
        email: user.email,
        bio: profileData?.bio || 'Passionate content creator sharing authentic reviews and lifestyle routines.',
        niche: profileData?.niche || ['Lifestyle'],
        primary_sector_key: (profileData?.niche?.[0] || 'lifestyle').toLowerCase(),
        categories: profileData?.categories || ['Short Form Video', 'Product Reviews'],
        content_types: ['Reels', 'Shorts'],
        location: profileData?.location || 'India',
        languages: profileData?.languages || ['English', 'Hindi'],
        social_platforms: profileData?.socialPlatforms || [
          { platform: 'instagram', handle: `@${name.toLowerCase()}`, url: 'https://instagram.com', followers: 15000, engagement: 6.5 },
        ],
        followers: profileData?.followers || 15000,
        followers_display: profileData?.followersDisplay || '15K',
        avg_views: '12K',
        engagement_rate: profileData?.engagementRate || 6.5,
        engagement_display: `${profileData?.engagementRate || 6.5}%`,
        creator_score: 82,
        creator_credits: 500,
        campaign_wins: 0,
        completed_campaigns: 0,
        total_reach: '15K',
        verified: false,
        audience_demographics: {
          age_breakdown: { '18-24': 60, '25-34': 30, '35+': 10 },
          gender_split: { female: 50, male: 50, other: 0 },
          top_locations: ['India (100%)'],
          top_interests: profileData?.categories || ['Lifestyle'],
        },
        portfolio: [],
        skills: ['Video Creation', 'Storytelling'],
        past_brands_worked_with: profileData?.pastBrandsWorkedWith || [],
        preferred_brand_categories: profileData?.preferredCategories || [],
        collaboration_preferences: { min_budget: 15000, preferred_deliverables: ['Instagram Reel (9:16)'], open_to_gifting: true },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      user,
      profile: createdProfile,
    });
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
