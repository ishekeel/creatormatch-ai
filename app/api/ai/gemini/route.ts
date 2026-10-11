import { NextResponse } from 'next/server';
import {
  getGeminiMatchExplanation,
  getGeminiPitchProposal,
  getGeminiCampaignDraft,
} from '@/lib/ai/geminiClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  '';

const genAI = new GoogleGenerativeAI(apiKey);
const MODEL_NAME = 'gemini-3.8-flash';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action is required' }, { status: 400 });
    }

    // 1. Deep AI Match Analysis
    if (action === 'match-analysis') {
      const { brand, creator } = body;
      if (!brand || !creator) {
        return NextResponse.json({ error: 'brand and creator objects required' }, { status: 400 });
      }
      const analysis = await getGeminiMatchExplanation(brand, creator);
      return NextResponse.json({ success: true, analysis });
    }

    // 2. Video Pitch Proposal Generator
    if (action === 'pitch-generator') {
      const { creator, campaign } = body;
      if (!creator || !campaign) {
        return NextResponse.json({ error: 'creator and campaign objects required' }, { status: 400 });
      }
      const proposal = await getGeminiPitchProposal(creator, campaign);
      return NextResponse.json({ success: true, proposal });
    }

    // 3. Campaign Brief & Deliverables Draft Generator
    if (action === 'campaign-draft') {
      const { brandName, industry, productName, objective } = body;
      if (!brandName || !industry) {
        return NextResponse.json({ error: 'brandName and industry required' }, { status: 400 });
      }
      const draft = await getGeminiCampaignDraft(brandName, industry, productName, objective);
      return NextResponse.json({ success: true, draft });
    }

    // 4. Conversational Assistant with Context
    if (action === 'assistant-chat') {
      const { message, role, context } = body;
      const model = genAI.getGenerativeModel({ model: MODEL_NAME });

      const prompt = `You are the CreatorMatch AI Strategic Assistant.
Context:
- User Role: ${role || 'user'}
- Context Info: ${JSON.stringify(context || {})}
User Query: "${message}"

Provide a professional, concise, and highly actionable response (max 3-4 bullet points or short paragraphs). Focus on influencer marketing ROI, content formatting (Reels/Shorts), creator-brand synergy, or campaign optimization.`;

      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      return NextResponse.json({ success: true, reply });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    console.error('[Gemini API Route Error]:', error);
    return NextResponse.json({ error: error?.message || 'Gemini AI generation failed' }, { status: 500 });
  }
}
