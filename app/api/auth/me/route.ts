import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    await dbEngine.ensureInitialized();

    if (userId) {
      const user = dbEngine.users.findById(userId);
      if (user) {
        const profile = user.role === 'brand'
          ? dbEngine.brandProfiles.findByUserId(user.id)
          : dbEngine.creatorProfiles.findByUserId(user.id);
        return NextResponse.json({ success: true, authenticated: true, user, profile, role: user.role });
      }
    }

    return NextResponse.json({ success: false, authenticated: false, user: null, profile: null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
