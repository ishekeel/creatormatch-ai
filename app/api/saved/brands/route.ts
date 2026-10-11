import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    if (!creatorId) {
      return NextResponse.json({ error: 'creatorId query parameter required' }, { status: 400 });
    }
    const savedIds = dbEngine.savedItems.getSavedBrands(creatorId);
    const brands = dbEngine.brandProfiles.all().filter(b => savedIds.includes(b.id));
    return NextResponse.json({ success: true, savedBrandIds: savedIds, brands });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { creatorId, brandId } = body;
    if (!creatorId || !brandId) {
      return NextResponse.json({ error: 'creatorId and brandId required' }, { status: 400 });
    }
    const saved = dbEngine.savedItems.saveBrand(creatorId, brandId);
    return NextResponse.json({ success: true, saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const creatorId = searchParams.get('creatorId');
    const brandId = searchParams.get('brandId');
    if (!creatorId || !brandId) {
      return NextResponse.json({ error: 'creatorId and brandId required' }, { status: 400 });
    }
    const unsaved = dbEngine.savedItems.unsaveBrand(creatorId, brandId);
    return NextResponse.json({ success: true, unsaved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
