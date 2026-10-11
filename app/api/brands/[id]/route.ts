import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brand = dbEngine.brandProfiles.findById(params.id);
    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    const campaigns = dbEngine.campaigns.findByBrandId(params.id);
    return NextResponse.json({ success: true, brand, campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = dbEngine.brandProfiles.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, brand: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
