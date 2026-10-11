import { NextResponse } from 'next/server';
import { dbEngine } from '@/lib/database';
import { calculateBrandToCreatorMatch, calculateCreatorToBrandMatch } from '@/lib/ai/matchingEngine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, role, currentId } = body;

    const p = (prompt || '').toLowerCase();
    const allCreators = dbEngine.creatorProfiles.all();
    const allBrands = dbEngine.brandProfiles.all();
    const allCampaigns = dbEngine.campaigns.all();

    if (role === 'brand') {
      const brand = dbEngine.brandProfiles.findById(currentId) || allBrands[0];
      const activeCampaign = dbEngine.campaigns.findByBrandId(brand.id)[0] || null;

      // Check if user is asking for creator recommendations
      if (p.includes('find') || p.includes('creator') || p.includes('best') || p.includes('match') || p.includes('recommend')) {
        const matches = allCreators.map(c => ({
          creator: c,
          match: calculateBrandToCreatorMatch(brand, c, activeCampaign),
        })).sort((a, b) => b.match.overallScore - a.match.overallScore);

        const top = matches.slice(0, 3);
        const reply = `Based on ${brand.brand_name}'s focus on ${brand.industry}, here are your top 3 matching creators from our verified database:\n\n` +
          top.map((m, i) => `${i + 1}. **${m.creator.creator_name}** (@${m.creator.handle}) — **${m.match.overallScore}% AI Fit**\n   • ${m.match.summary}\n   • Key Signal: ${m.match.positiveFactors[0] || 'High sector fit'}`).join('\n\n') +
          `\n\nYou can review their pitch videos and send collaboration invites directly from the Creator Discovery portal.`;

        return NextResponse.json({
          success: true,
          reply,
          recommendations: top.map(m => ({ creator: m.creator, score: m.match.overallScore })),
        });
      }
    } else {
      const creator = dbEngine.creatorProfiles.findById(currentId) || allCreators[0];
      if (p.includes('find') || p.includes('brand') || p.includes('campaign') || p.includes('sponsor') || p.includes('match')) {
        const matches = allBrands.map(b => ({
          brand: b,
          match: calculateCreatorToBrandMatch(creator, b, allCampaigns),
        })).sort((a, b) => b.match.overallScore - a.match.overallScore);

        const top = matches.slice(0, 3);
        const reply = `Based on your profile as a **${creator.niche.join('/')}** creator with **${creator.engagement_display}** engagement, here are your top 3 brand matches:\n\n` +
          top.map((m, i) => `${i + 1}. **${m.brand.brand_name}** (${m.brand.industry}) — **${m.match.overallScore}% AI Fit**\n   • ${m.match.summary}\n   • ${m.match.positiveFactors[0] || 'High content resonance'}`).join('\n\n') +
          `\n\nVisit the "Find Brands For You" portal to explore their campaign briefs and submit your pitch video.`;

        return NextResponse.json({
          success: true,
          reply,
          recommendations: top.map(m => ({ brand: m.brand, score: m.match.overallScore })),
        });
      }
    }

    // Use Gemini generative model for conversational answers
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (apiKey) {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });
        const entityName = role === 'brand'
          ? (dbEngine.brandProfiles.findById(currentId)?.brand_name || 'Brand')
          : (dbEngine.creatorProfiles.findById(currentId)?.creator_name || 'Creator');

        const systemPrompt = `You are CreatorMatch AI Assistant, the smart co-pilot on the platform connecting Brands and Content Creators.
Role of current user: ${role} (${entityName}).
User question: "${prompt}"

Provide a concise, practical, and highly professional answer (2-3 short paragraphs max) with advice on influencer partnerships, UGC, video hook optimization, or campaign management.`;

        const geminiRes = await model.generateContent(systemPrompt);
        const geminiText = geminiRes.response.text();
        if (geminiText) {
          return NextResponse.json({
            success: true,
            reply: geminiText,
          });
        }
      }
    } catch (geminiErr) {
      console.warn('[AI Assistant] Gemini query fallback:', geminiErr);
    }

    if (role === 'brand') {
      const brand = dbEngine.brandProfiles.findById(currentId) || allBrands[0];
      return NextResponse.json({
        success: true,
        reply: `I am your CreatorMatch AI Assistant for ${brand.brand_name}. I can analyze our database of creators across Fashion, Gaming, Tech, Food, and Fitness to find high-ROI campaign partners with verified audience fit. Try asking: "Find me top creators for our upcoming campaign".`,
      });
    } else {
      const creator = dbEngine.creatorProfiles.findById(currentId) || allCreators[0];
      return NextResponse.json({
        success: true,
        reply: `I am your CreatorMatch AI Assistant for ${creator.creator_name}. I continuously scan our database of active brand campaigns in ${creator.niche.join(', ')} to find high-paying sponsorship deals tailored to your content format. Ask me: "Find brands that match my content".`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
