import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    if (userId) {
      await dbEngine.users.update(userId, {
        is_logged_in: false,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Logout error' }, { status: 500 });
  }
}
