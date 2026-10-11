export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const participantId = searchParams.get('participantId');

    if (conversationId) {
      const messages = dbEngine.messages.findByConversation(conversationId);
      const conversation = dbEngine.conversations.findById(conversationId);
      return NextResponse.json({ success: true, conversation, messages });
    }

    if (participantId) {
      const conversations = dbEngine.conversations.findByParticipant(participantId);
      return NextResponse.json({ success: true, conversations });
    }

    const conversations = dbEngine.conversations.all();
    return NextResponse.json({ success: true, conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      conversation_id,
      conversationId,
      sender_id,
      senderId,
      sender_name,
      senderName,
      sender_avatar,
      senderAvatar,
      sender_role,
      senderRole,
      text,
      timestamp,
      brand_id,
      brandId,
      creator_id,
      creatorId,
      brand_name,
      creator_name,
    } = body;

    const convId = conversation_id || conversationId;
    const sId = sender_id || senderId;
    const sName = sender_name || senderName || 'User';
    const sAvatar = sender_avatar || senderAvatar || '';
    const sRole = (sender_role || senderRole || 'brand') as 'brand' | 'creator';
    const msgText = (text || '').trim();
    const time = timestamp || 'Just now';

    if (!convId || !msgText) {
      return NextResponse.json({ error: 'conversationId and text are required' }, { status: 400 });
    }

    // Ensure conversation exists or create
    let conv = dbEngine.conversations.findById(convId);
    if (!conv) {
      const bId = brand_id || brandId || (sRole === 'brand' ? sId : '');
      const cId = creator_id || creatorId || (sRole === 'creator' ? sId : '');
      conv = dbEngine.conversations.create({
        id: convId,
        brand_id: bId,
        creator_id: cId,
        participant_id: sRole === 'brand' ? cId : bId,
        participant_name: sRole === 'brand' ? (creator_name || 'Creator') : (brand_name || 'Brand'),
        participant_avatar: '',
        participant_role: sRole === 'brand' ? 'creator' : 'brand',
        last_message: msgText,
        last_message_time: time,
        unread_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Save message
    const newMsg = dbEngine.messages.create({
      conversation_id: convId,
      sender_id: sId,
      sender_name: sName,
      sender_avatar: sAvatar,
      sender_role: sRole,
      text: msgText,
      timestamp: time,
    });

    return NextResponse.json({ success: true, message: newMsg, conversation: conv });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
