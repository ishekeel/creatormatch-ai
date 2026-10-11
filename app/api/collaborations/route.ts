export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';
import { calculateBrandToCreatorMatch } from '@/lib/ai/matchingEngine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandId = searchParams.get('brandId');
    const creatorId = searchParams.get('creatorId');
    const campaignId = searchParams.get('campaignId');
    const status = searchParams.get('status');

    let requests = dbEngine.collaborationRequests.all();

    if (brandId) {
      requests = requests.filter(r => r.brand_id === brandId);
    }
    if (creatorId) {
      requests = requests.filter(r => r.creator_id === creatorId);
    }
    if (campaignId) {
      requests = requests.filter(r => r.campaign_id === campaignId);
    }
    if (status && status !== 'All') {
      requests = requests.filter(r => r.status === status);
    }

    return NextResponse.json({ success: true, count: requests.length, requests });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      sender_id,
      sender_role,
      brand_id,
      creator_id,
      campaign_id,
      deliverable_type,
      pitch_video_url,
      pitch_video_title,
      concept_pitch,
      message,
    } = body;

    const brand = dbEngine.brandProfiles.findById(brand_id);
    const creator = dbEngine.creatorProfiles.findById(creator_id);
    const campaign = campaign_id ? dbEngine.campaigns.findById(campaign_id) : null;

    if (!brand || !creator) {
      return NextResponse.json({ error: 'Invalid brand_id or creator_id' }, { status: 400 });
    }

    // Dynamic AI score calculation
    const matchResult = calculateBrandToCreatorMatch(brand, creator, campaign);

    const collabId = `collab-${Date.now()}`;
    const newCollab = dbEngine.collaborationRequests.create({
      id: collabId,
      sender_id: sender_id || (sender_role === 'creator' ? creator.id : brand.id),
      sender_role: sender_role || 'creator',
      receiver_id: sender_role === 'creator' ? brand.id : creator.id,
      receiver_role: sender_role === 'creator' ? 'brand' : 'creator',
      brand_id: brand.id,
      brand_name: brand.brand_name,
      brand_logo: brand.logo,
      creator_id: creator.id,
      creator_name: creator.creator_name,
      creator_avatar: creator.avatar,
      campaign_id: campaign?.id || null,
      campaign_name: campaign?.name || null,
      deliverable_type: deliverable_type || 'Instagram Reel (9:16)',
      pitch_video_url: pitch_video_url || null,
      pitch_video_title: pitch_video_title || `${creator.creator_name} Proposal`,
      concept_pitch: concept_pitch || message || 'High-relevance content proposal aligned with campaign brief.',
      match_score: matchResult.overallScore,
      status: 'pending',
      message: message || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Update campaign creator tracking if campaign is present
    if (campaign) {
      if (sender_role === 'creator') {
        const applied = Array.from(new Set([...campaign.applied_creator_ids, creator.id]));
        dbEngine.campaigns.update(campaign.id, { applied_creator_ids: applied });
      } else {
        const invited = Array.from(new Set([...campaign.invited_creator_ids, creator.id]));
        dbEngine.campaigns.update(campaign.id, { invited_creator_ids: invited });
      }
    }

    // Send high-priority notification to recipient
    if (sender_role === 'creator') {
      dbEngine.notifications.create({
        user_id: brand.id,
        role: 'brand',
        title: 'New Campaign Application & Pitch Video 🎥',
        message: `${creator.creator_name} applied for "${campaign?.name || 'Campaign'}" with a pitch video (${matchResult.overallScore}% AI fit).`,
        type: 'request',
        read: false,
        action_url: '/brand/campaigns',
      });
    } else {
      dbEngine.notifications.create({
        user_id: creator.id,
        role: 'creator',
        title: 'New Brand Collaboration Invite 💼',
        message: `${brand.brand_name} invited you to collaborate (${matchResult.overallScore}% AI match)!`,
        type: 'invite',
        read: false,
        action_url: campaign ? `/creator/campaigns/${campaign.id}` : '/creator/campaigns',
      });
    }

    return NextResponse.json({ success: true, collaboration: newCollab, match: matchResult });
  } catch (error: any) {
    console.error('Collaboration POST Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !['accepted', 'declined', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Valid id and status ("accepted" | "declined") required' }, { status: 400 });
    }

    const collab = dbEngine.collaborationRequests.findById(id);
    if (!collab) {
      return NextResponse.json({ error: 'Collaboration request not found' }, { status: 404 });
    }

    const updated = dbEngine.collaborationRequests.updateStatus(id, status);

    if (status === 'accepted') {
      // If attached to a campaign, update accepted_creator_ids
      if (collab.campaign_id) {
        const camp = dbEngine.campaigns.findById(collab.campaign_id);
        if (camp) {
          const accepted = Array.from(new Set([...camp.accepted_creator_ids, collab.creator_id]));
          dbEngine.campaigns.update(camp.id, { accepted_creator_ids: accepted });
        }
      }

      // Automatically create or unlock direct conversation
      const convId = `conv-${collab.creator_id}-${collab.brand_id}`;
      let conv = dbEngine.conversations.findById(convId);
      if (!conv) {
        conv = dbEngine.conversations.create({
          id: convId,
          creator_id: collab.creator_id,
          brand_id: collab.brand_id,
          participant_id: collab.creator_id,
          participant_name: collab.creator_name,
          participant_avatar: collab.creator_avatar,
          participant_role: 'creator',
          last_message: `Collaboration accepted for ${collab.campaign_name || 'Campaign'}!`,
          last_message_time: 'Just now',
          unread_count: 0,
          campaign_context: collab.campaign_id ? { id: collab.campaign_id, name: collab.campaign_name || '' } : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        // Add first welcome message
        dbEngine.messages.create({
          conversation_id: convId,
          sender_id: collab.brand_id,
          sender_name: collab.brand_name,
          sender_avatar: collab.brand_logo,
          sender_role: 'brand',
          text: `Hi ${collab.creator_name}! We accepted your proposal for ${collab.campaign_name || 'our campaign'}. Excited to collaborate with you!`,
          timestamp: 'Just now',
        });
      }

      // Notify creator
      dbEngine.notifications.create({
        user_id: collab.creator_id,
        role: 'creator',
        title: 'Pitch Proposal Accepted! 🎉',
        message: `${collab.brand_name} accepted your application for ${collab.campaign_name || 'the campaign'}! Direct messaging is now unlocked.`,
        type: 'approval',
        read: false,
        action_url: '/creator/messages',
      });
    }

    return NextResponse.json({ success: true, collaboration: updated });
  } catch (error: any) {
    console.error('Collaboration PATCH Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
