export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = (searchParams.get('role') as 'brand' | 'creator') || undefined;

    const notifs = dbEngine.notifications.findByUser(userId || '', role);
    return NextResponse.json({ success: true, count: notifs.length, notifications: notifs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, userId, markAll } = body;

    if (markAll && userId) {
      dbEngine.notifications.markAllRead(userId);
      return NextResponse.json({ success: true });
    }

    if (id) {
      dbEngine.notifications.markRead(id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'id or (markAll and userId) required' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
