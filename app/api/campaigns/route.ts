import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let campaigns = dbEngine.campaigns.all();

    if (brandId) {
      campaigns = campaigns.filter(c => c.brand_id === brandId);
    }
    if (category && category !== 'All') {
      campaigns = campaigns.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (status && status !== 'All') {
      campaigns = campaigns.filter(c => c.status === status);
    }

    return NextResponse.json({ success: true, count: campaigns.length, campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const body = await request.json();
    const campaignId = `camp-${Date.now()}`;
    const newCampaign = await dbEngine.campaigns.create({
      id: campaignId,
      brand_id: body.brand_id,
      brand_name: body.brand_name || 'Brand',
      brand_logo: body.brand_logo || '',
      name: body.name,
      product: body.product,
      category: body.category || 'General',
      sector_key: (body.category || 'general').toLowerCase(),
      description: body.description || '',
      product_image: body.product_image || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
      objective: body.objective || 'Brand Awareness',
      target_audience: body.target_audience || {
        age: '18-34',
        gender: 'All',
        location: 'India',
        language: 'English',
        interests: [],
      },
      required_platforms: body.required_platforms || ['Instagram'],
      deliverables: body.deliverables || [
        { id: `del-1`, type: 'Instagram Reel (9:16)', quantity: 1, reward: 50000 },
      ],
      guidelines: body.guidelines,
      timeline: body.timeline || {
        startDate: 'Today',
        endDate: '30 Days',
        submissionDeadline: '15 Days',
      },
      budget: body.budget || 100000,
      reward_display: body.reward_display || '₹50,000 per creator',
      deadline_display: body.deadline_display || '30 Days',
      invited_creator_ids: [],
      accepted_creator_ids: [],
      applied_creator_ids: [],
      status: body.status || 'active',
      reach: '0K',
      engagement: '0%',
      conversions: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
