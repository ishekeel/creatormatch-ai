import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creator = dbEngine.creatorProfiles.findById(params.id);
    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, creator });
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
    const updated = dbEngine.creatorProfiles.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, creator: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
