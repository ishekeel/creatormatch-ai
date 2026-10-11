import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const minEngagement = searchParams.get('minEngagement') ? parseFloat(searchParams.get('minEngagement')!) : 0;

    let creators = dbEngine.creatorProfiles.all();

    if (category && category !== 'All') {
      creators = creators.filter(
        c =>
          c.niche.some(n => n.toLowerCase().includes(category.toLowerCase())) ||
          c.categories.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
      );
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
          c.bio.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      count: creators.length,
      creators,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const body = await request.json();
    const creatorId = `creator-${Date.now()}`;
    const newCreator = await dbEngine.creatorProfiles.create({
      id: creatorId,
      user_id: body.user_id || `user-${creatorId}`,
      creator_name: body.creator_name,
      handle: body.handle ? body.handle.replace('@', '') : body.creator_name.toLowerCase().replace(/\s+/g, '_'),
      avatar: body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      email: body.email || '',
      bio: body.bio || '',
      niche: body.niche || ['Lifestyle'],
      primary_sector_key: (body.niche?.[0] || 'lifestyle').toLowerCase(),
      categories: body.categories || [],
      content_types: body.content_types || ['Reels'],
      location: body.location || 'India',
      languages: body.languages || ['English', 'Hindi'],
      social_platforms: body.social_platforms || [],
      followers: body.followers || 10000,
      followers_display: body.followers_display || '10K',
      avg_views: body.avg_views || '8K',
      engagement_rate: body.engagement_rate || 5.0,
      engagement_display: `${body.engagement_rate || 5.0}%`,
      creator_score: body.creator_score || 80,
      creator_credits: body.creator_credits || 500,
      campaign_wins: 0,
      completed_campaigns: 0,
      total_reach: body.total_reach || '10K',
      verified: false,
      audience_demographics: body.audience_demographics || {
        age_breakdown: { '18-24': 60, '25-34': 30, '35+': 10 },
        gender_split: { female: 50, male: 50, other: 0 },
        top_locations: ['India (100%)'],
        top_interests: body.categories || ['Lifestyle'],
      },
      portfolio: body.portfolio || [],
      skills: body.skills || ['Video Creation'],
      past_brands_worked_with: body.past_brands_worked_with || [],
      preferred_brand_categories: body.preferred_brand_categories || [],
      collaboration_preferences: body.collaboration_preferences || { min_budget: 15000, preferred_deliverables: [], open_to_gifting: true },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, creator: newCreator });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
