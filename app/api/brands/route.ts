import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');

    let brands = dbEngine.brandProfiles.all();

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

    return NextResponse.json({
      success: true,
      count: brands.length,
      brands,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbEngine.ensureInitialized();
    const body = await request.json();
    const brandId = `brand-${Date.now()}`;
    const newBrand = await dbEngine.brandProfiles.create({
      id: brandId,
      user_id: body.user_id || `user-${brandId}`,
      brand_name: body.brand_name,
      logo: body.logo || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
      description: body.description || '',
      industry: body.industry || 'Fashion',
      sector_key: (body.industry || 'fashion').toLowerCase(),
      location: body.location || 'India',
      operating_duration: body.operating_duration || '1 Year',
      established_year: body.established_year || new Date().getFullYear().toString(),
      website: body.website || '',
      products: body.products || [],
      target_audience: body.target_audience || {
        age: '18-34',
        gender: 'All',
        location: 'India',
        interests: [],
        description: '',
      },
      preferred_platforms: body.preferred_platforms || ['Instagram'],
      preferred_creator_categories: body.preferred_creator_categories || [],
      budget_range: body.budget_range || '₹50,000 - ₹2,00,000',
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

    return NextResponse.json({ success: true, brand: newBrand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
