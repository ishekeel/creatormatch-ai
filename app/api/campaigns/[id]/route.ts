import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaign = dbEngine.campaigns.findById(params.id);
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    const applications = dbEngine.collaborationRequests.findByCampaignId(params.id);
    return NextResponse.json({ success: true, campaign, applications });
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
    const updated = dbEngine.campaigns.update(params.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, campaign: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
