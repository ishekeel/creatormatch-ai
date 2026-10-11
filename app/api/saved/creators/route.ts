import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    if (!brandId) {
      return NextResponse.json({ error: 'brandId query parameter required' }, { status: 400 });
    }
    const savedIds = dbEngine.savedItems.getSavedCreators(brandId);
    const creators = dbEngine.creatorProfiles.all().filter(c => savedIds.includes(c.id));
    return NextResponse.json({ success: true, savedCreatorIds: savedIds, creators });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brandId, creatorId } = body;
    if (!brandId || !creatorId) {
      return NextResponse.json({ error: 'brandId and creatorId required' }, { status: 400 });
    }
    const saved = dbEngine.savedItems.saveCreator(brandId, creatorId);
    return NextResponse.json({ success: true, saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const creatorId = searchParams.get('creatorId');
    if (!brandId || !creatorId) {
      return NextResponse.json({ error: 'brandId and creatorId required' }, { status: 400 });
    }
    const unsaved = dbEngine.savedItems.unsaveCreator(brandId, creatorId);
    return NextResponse.json({ success: true, unsaved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
