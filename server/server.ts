import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { dbEngine } from '../lib/database';
import {
  calculateBrandToCreatorMatch,
  calculateCreatorToBrandMatch,
  classifySector,
  normalizeSector,
} from '../lib/ai/matchingEngine';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// -----------------------------------------------------------------------------
// 1. HEALTH & SYSTEM STATUS (Render Health Check)
// -----------------------------------------------------------------------------
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'CreatorMatch AI Backend API',
    version: '1.0.0',
    documentation: '/api',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'CreatorMatch AI API Gateway is active.',
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/register', '/api/auth/me'],
      brands: ['/api/brands', '/api/brands/:id', '/api/brands/:id/recommended-creators'],
      creators: ['/api/creators', '/api/creators/:id', '/api/creators/:id/recommended-brands'],
      campaigns: ['/api/campaigns', '/api/campaigns/:id', '/api/campaigns/:id/apply'],
      collaborations: ['/api/collaborations'],
      ai: ['/api/ai/match', '/api/ai/assistant'],
      stats: ['/api/stats/dashboard'],
    },
  });
});

// -----------------------------------------------------------------------------
// 2. AUTHENTICATION CONTROLLER
// -----------------------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = dbEngine.users.findByEmail(cleanEmail);

    if (!user) {
      // Check fallback by brand or creator name
      const allBrands = dbEngine.brandProfiles.all();
      const allCreators = dbEngine.creatorProfiles.all();

      const matchedBrand = allBrands.find(b => b.brand_name.toLowerCase().includes(cleanEmail));
      if (matchedBrand) {
        return res.json({
          success: true,
          user: { id: matchedBrand.user_id, email: cleanEmail, role: 'brand', name: matchedBrand.brand_name },
          profile: matchedBrand,
          role: 'brand',
          token: `token_${matchedBrand.id}_${Date.now()}`,
        });
      }

      const matchedCreator = allCreators.find(c =>
        c.creator_name.toLowerCase().includes(cleanEmail) ||
        c.handle.toLowerCase().replace('@', '') === cleanEmail.replace('@', '')
      );
      if (matchedCreator) {
        return res.json({
          success: true,
          user: { id: matchedCreator.user_id, email: cleanEmail, role: 'creator', name: matchedCreator.creator_name },
          profile: matchedCreator,
          role: 'creator',
          token: `token_${matchedCreator.id}_${Date.now()}`,
        });
      }

      return res.status(404).json({ error: 'No account found with this email / user ID' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        error: `Account is registered as ${user.role}, not ${role}. Please choose the matching login portal.`,
      });
    }

    let profile: any = null;
    if (user.role === 'brand') {
      profile = dbEngine.brandProfiles.findByUserId(user.id) || dbEngine.brandProfiles.all()[0];
    } else {
      profile = dbEngine.creatorProfiles.findByUserId(user.id) || dbEngine.creatorProfiles.all()[0];
    }

    return res.json({
      success: true,
      user,
      profile,
      role: user.role,
      token: `token_${user.id}_${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { role, email, password, name, profileData } = req.body;
    if (!email || !role || !name) {
      return res.status(400).json({ error: 'Role, name, and email are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = dbEngine.users.findByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const userId = `user-${role}-${Date.now()}`;
    const newUser = dbEngine.users.create({
      id: userId,
      email: cleanEmail,
      password_hash: password || 'demo123',
      role,
      name,
      avatar: profileData?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    });

    let newProfile: any = null;
    if (role === 'brand') {
      const brandId = `brand-${Date.now()}`;
      newProfile = dbEngine.brandProfiles.create({
        id: brandId,
        user_id: userId,
        brand_name: name,
        logo: profileData?.logo || newUser.avatar,
        description: profileData?.description || `${name} official brand sponsor.`,
        industry: profileData?.industry || 'Fashion & Apparel',
        sector_key: classifySector(profileData?.industry || 'Fashion'),
        location: profileData?.location || 'Mumbai, India',
        operating_duration: profileData?.operatingDuration || '2 Years',
        established_year: '2024',
        website: profileData?.website || `https://${name.toLowerCase().replace(/\s+/g, '')}.com`,
        products: profileData?.products || [],
        target_audience: {
          age: profileData?.targetAudienceAge || '18-34',
          gender: 'All',
          location: profileData?.location || 'India',
          interests: [],
          description: profileData?.targetAudience || 'Active consumer buyers',
        },
        preferred_platforms: ['Instagram', 'YouTube'],
        preferred_creator_categories: [],
        budget_range: '₹1,00,000 - ₹5,00,000',
        stats: {
          active_campaigns: 0,
          creators_collaborating: 0,
          total_reach: '0',
          avg_engagement: '0%',
          conversions: 0,
          roi: '0x',
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      const creatorId = `creator-${Date.now()}`;
      const primarySector = profileData?.primarySector || profileData?.niche?.[0] || 'Food & Cooking';
      newProfile = dbEngine.creatorProfiles.create({
        id: creatorId,
        user_id: userId,
        creator_name: name,
        handle: profileData?.handle || `@${name.toLowerCase().replace(/\s+/g, '')}`,
        avatar: profileData?.avatar || newUser.avatar,
        email: cleanEmail,
        bio: profileData?.bio || `Content creator specializing in ${primarySector}.`,
        niche: [primarySector, ...(profileData?.secondaryNiches || [])],
        primary_sector_key: classifySector(primarySector),
        categories: [primarySector],
        content_types: ['Reels', 'Shorts', 'Reviews'],
        location: profileData?.location || 'Mumbai, India',
        languages: ['English', 'Hindi'],
        social_platforms: [
          {
            platform: 'instagram',
            handle: profileData?.handle || `@${name.toLowerCase().replace(/\s+/g, '')}`,
            url: `https://instagram.com`,
            followers: profileData?.followers || 50000,
            engagement: 7.2,
          },
        ],
        followers: profileData?.followers || 50000,
        followers_display: '50K',
        avg_views: '22,000',
        engagement_rate: 7.2,
        engagement_display: '7.2%',
        creator_score: 92,
        creator_credits: 500,
        completed_campaigns: 0,
        total_reach: '50K',
        verified: true,
        audience_demographics: {
          age_breakdown: { '18-24': 60, '25-34': 30, '35+': 10 },
          top_locations: ['Mumbai (40%)', 'Delhi (35%)', 'Other (25%)'],
          gender_split: { female: 65, male: 30, other: 5 },
          top_interests: [primarySector],
        },
        portfolio: profileData?.portfolio || [],
        skills: profileData?.skills || ['Short-Form Video', 'UGC Storytelling', 'Product Demonstration'],
        past_brands_worked_with: profileData?.pastBrandsWorkedWith || [],
        preferred_brand_categories: [primarySector],
        collaboration_preferences: {
          min_budget: 25000,
          preferred_deliverables: ['Instagram Reel (9:16)'],
          open_to_gifting: true,
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return res.status(201).json({
      success: true,
      user: newUser,
      profile: newProfile,
      role,
      token: `token_${userId}_${Date.now()}`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// -----------------------------------------------------------------------------
// 3. BRANDS CONTROLLER
// -----------------------------------------------------------------------------
app.get('/api/brands', (req: Request, res: Response) => {
  const { sector, search } = req.query;
  let brands = dbEngine.brandProfiles.all();

  if (sector && sector !== 'All') {
    brands = brands.filter(b =>
      b.industry.toLowerCase().includes(String(sector).toLowerCase()) ||
      b.sector_key.toLowerCase() === String(sector).toLowerCase()
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    brands = brands.filter(b =>
      b.brand_name.toLowerCase().includes(q) ||
      b.industry.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: brands.length, data: brands });
});

app.get('/api/brands/:id', (req: Request, res: Response) => {
  const brandId = req.params.id as string;
  const brand = dbEngine.brandProfiles.findById(brandId);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });

  const campaigns = dbEngine.campaigns.findByBrandId(brand.id);
  res.json({ success: true, data: brand, campaigns });
});

app.put('/api/brands/:id', (req: Request, res: Response) => {
  const brandId = req.params.id as string;
  const updated = dbEngine.brandProfiles.update(brandId, req.body);
  if (!updated) return res.status(404).json({ error: 'Brand not found' });
  res.json({ success: true, data: updated });
});

/**
 * AI-Powered Creator Recommendations for a Brand
 * Grounded deterministic ranking: Same sector gets 95%+ First Priority!
 */
app.get('/api/brands/:id/recommended-creators', (req: Request, res: Response) => {
  const brandId = req.params.id as string;
  const brand = dbEngine.brandProfiles.findById(brandId);
  if (!brand) return res.status(404).json({ error: 'Brand not found' });

  const creators = dbEngine.creatorProfiles.all();
  const campaigns = dbEngine.campaigns.findByBrandId(brand.id);
  const activeCampaign = campaigns.find(c => c.status === 'active') || campaigns[0] || null;

  const recommendations = creators
    .map(creator => {
      const matchResult = calculateBrandToCreatorMatch(brand, creator, activeCampaign);
      return {
        creatorId: creator.id,
        creatorName: creator.creator_name,
        handle: creator.handle,
        avatar: creator.avatar,
        sector: creator.primary_sector_key,
        niches: creator.niche,
        followers: creator.followers,
        followersDisplay: creator.followers_display,
        engagementRate: creator.engagement_rate,
        engagementDisplay: creator.engagement_display,
        matchScore: matchResult.overallScore,
        verdict: matchResult.recommendationVerdict,
        summary: matchResult.summary,
        positiveFactors: matchResult.positiveFactors,
        negativeFactors: matchResult.negativeFactors,
        breakdown: matchResult.breakdown,
        portfolioCount: (creator.portfolio || []).length,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    success: true,
    brandId: brand.id,
    brandName: brand.brand_name,
    brandSector: brand.sector_key,
    count: recommendations.length,
    recommendations,
  });
});

// -----------------------------------------------------------------------------
// 4. CREATORS CONTROLLER
// -----------------------------------------------------------------------------
app.get('/api/creators', (req: Request, res: Response) => {
  const { sector, search } = req.query;
  let creators = dbEngine.creatorProfiles.all();

  if (sector && sector !== 'All') {
    creators = creators.filter(c =>
      c.primary_sector_key.toLowerCase() === String(sector).toLowerCase() ||
      c.niche.some(n => n.toLowerCase().includes(String(sector).toLowerCase()))
    );
  }

  if (search) {
    const q = String(search).toLowerCase();
    creators = creators.filter(c =>
      c.creator_name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.bio.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: creators.length, data: creators });
});

app.get('/api/creators/:id', (req: Request, res: Response) => {
  const creatorId = req.params.id as string;
  const creator = dbEngine.creatorProfiles.findById(creatorId);
  if (!creator) return res.status(404).json({ error: 'Creator not found' });
  res.json({ success: true, data: creator });
});

app.put('/api/creators/:id', (req: Request, res: Response) => {
  const creatorId = req.params.id as string;
  const updated = dbEngine.creatorProfiles.update(creatorId, req.body);
  if (!updated) return res.status(404).json({ error: 'Creator not found' });
  res.json({ success: true, data: updated });
});

/**
 * Reverse AI-Powered Brand Recommendations for a Creator ("Find Brands For You")
 */
app.get('/api/creators/:id/recommended-brands', (req: Request, res: Response) => {
  const creatorId = req.params.id as string;
  const creator = dbEngine.creatorProfiles.findById(creatorId);
  if (!creator) return res.status(404).json({ error: 'Creator not found' });

  const brands = dbEngine.brandProfiles.all();
  const allCampaigns = dbEngine.campaigns.all();

  const recommendations = brands
    .map(brand => {
      const matchResult = calculateCreatorToBrandMatch(creator, brand, allCampaigns);
      const brandCampaigns = allCampaigns.filter(c => c.brand_id === brand.id);
      return {
        brandId: brand.id,
        brandName: brand.brand_name,
        logo: brand.logo,
        industry: brand.industry,
        sector: brand.sector_key,
        matchScore: matchResult.overallScore,
        verdict: matchResult.recommendationVerdict,
        summary: matchResult.summary,
        positiveFactors: matchResult.positiveFactors,
        negativeFactors: matchResult.negativeFactors,
        breakdown: matchResult.breakdown,
        activeCampaignsCount: brandCampaigns.length,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  res.json({
    success: true,
    creatorId: creator.id,
    creatorName: creator.creator_name,
    creatorSector: creator.primary_sector_key,
    count: recommendations.length,
    recommendations,
  });
});

// -----------------------------------------------------------------------------
// 5. CAMPAIGNS & CHALLENGES CONTROLLER
// -----------------------------------------------------------------------------
app.get('/api/campaigns', (req: Request, res: Response) => {
  const { brandId, category } = req.query;
  let list = dbEngine.campaigns.all();

  if (brandId) {
    list = list.filter(c => c.brand_id === String(brandId));
  }
  if (category) {
    list = list.filter(c => c.category.toLowerCase().includes(String(category).toLowerCase()));
  }

  res.json({ success: true, count: list.length, data: list });
});

app.get('/api/campaigns/:id', (req: Request, res: Response) => {
  const campaignId = req.params.id as string;
  const campaign = dbEngine.campaigns.findById(campaignId);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ success: true, data: campaign });
});

app.post('/api/campaigns', (req: Request, res: Response) => {
  try {
    const data = req.body;
    if (!data.name || !data.brand_id) {
      return res.status(400).json({ error: 'Campaign name and brand_id are required' });
    }

    const brand = dbEngine.brandProfiles.findById(data.brand_id);
    const campaignId = `camp-${Date.now()}`;

    const newCampaign = dbEngine.campaigns.create({
      id: campaignId,
      brand_id: data.brand_id,
      brand_name: brand?.brand_name || data.brand_name || 'Brand Sponsor',
      brand_logo: brand?.logo || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150',
      name: data.name,
      product: data.product || 'Featured Product',
      category: data.category || brand?.industry || 'Fashion',
      sector_key: classifySector(data.category || brand?.industry || 'Fashion'),
      description: data.description || 'Campaign deliverables brief',
      product_image: data.product_image || 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
      objective: data.objective || 'Brand Awareness & UGC Engagement',
      target_audience: data.target_audience || {
        age: '18-24',
        gender: 'All',
        location: 'India',
        language: 'English',
        interests: [],
      },
      required_platforms: data.required_platforms || ['Instagram', 'YouTube Shorts'],
      deliverables: data.deliverables || [{ type: 'reel', quantity: 1, duration: '30s' }],
      guidelines: data.guidelines || [
        'Highlight product naturally within the first 3 seconds of the reel.',
        'Include brand tag and verified campaign hashtag in the first 2 lines of the caption.',
      ],
      timeline: data.timeline || {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        submissionDeadline: new Date(Date.now() + 86400000 * 20).toISOString(),
      },
      budget: Number(data.budget) || 150000,
      reward_display: data.reward_display || '₹1,50,000',
      deadline_display: data.deadline_display || '20 Days Left',
      invited_creator_ids: [],
      accepted_creator_ids: [],
      applied_creator_ids: [],
      status: 'active',
      reach: '2.5M',
      engagement: '7.4%',
      conversions: 1200,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: newCampaign });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed creating campaign' });
  }
});

// Apply to Campaign with Video Pitch Proposal
app.post('/api/campaigns/:id/apply', (req: Request, res: Response) => {
  try {
    const { creatorId, deliverableType, pitchVideoUrl, pitchVideoTitle, conceptPitch } = req.body;
    const campaignId = req.params.id as string;
    const campaign = dbEngine.campaigns.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const creator = dbEngine.creatorProfiles.findById(creatorId);
    if (!creator) return res.status(404).json({ error: 'Creator not found' });

    // Calculate match score
    const match = calculateBrandToCreatorMatch(
      dbEngine.brandProfiles.findById(campaign.brand_id) || dbEngine.brandProfiles.all()[0],
      creator,
      campaign
    );

    // Create collaboration application record
    const collabReq = dbEngine.collaborationRequests.create({
      id: `collab-${Date.now()}`,
      sender_id: creator.id,
      sender_role: 'creator',
      receiver_id: campaign.brand_id,
      receiver_role: 'brand',
      brand_id: campaign.brand_id,
      brand_name: campaign.brand_name,
      brand_logo: campaign.brand_logo,
      creator_id: creator.id,
      creator_name: creator.creator_name,
      creator_avatar: creator.avatar,
      campaign_id: campaign.id,
      campaign_name: campaign.name,
      deliverable_type: deliverableType || 'Instagram Reel (9:16)',
      pitch_video_url: pitchVideoUrl || 'https://instagram.com/reel/sample',
      pitch_video_title: pitchVideoTitle || 'Creator Video Pitch',
      concept_pitch: conceptPitch || 'Proposal for campaign deliverables',
      match_score: match.overallScore,
      status: 'pending',
      message: conceptPitch || 'Applied for collaboration',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Notify brand
    dbEngine.notifications.create({
      user_id: campaign.brand_id,
      role: 'brand',
      title: 'New Video Pitch Proposal 🎥',
      message: `${creator.creator_name} submitted a pitch proposal for "${campaign.name}" (${match.overallScore}% AI Match).`,
      type: 'invite',
      read: false,
      action_url: `/brand/campaigns/${campaign.id}`,
    });

    res.status(201).json({ success: true, application: collabReq, matchScore: match.overallScore });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Application failed' });
  }
});

// -----------------------------------------------------------------------------
// 6. COLLABORATIONS & PROPOSALS CONTROLLER
// -----------------------------------------------------------------------------
app.get('/api/collaborations', (req: Request, res: Response) => {
  const { brandId, creatorId, status } = req.query;
  let list = dbEngine.collaborationRequests.all();

  if (brandId) list = list.filter(c => c.brand_id === String(brandId));
  if (creatorId) list = list.filter(c => c.creator_id === String(creatorId));
  if (status) list = list.filter(c => c.status === String(status));

  res.json({ success: true, count: list.length, data: list });
});

app.put('/api/collaborations/:id', (req: Request, res: Response) => {
  const { status } = req.body;
  if (!status || !['accepted', 'declined', 'pending'].includes(status)) {
    return res.status(400).json({ error: 'Status must be accepted, declined, or pending' });
  }

  const collabId = req.params.id as string;
  const updated = dbEngine.collaborationRequests.updateStatus(collabId, status);
  if (!updated) return res.status(404).json({ error: 'Collaboration request not found' });

  // If accepted, notify creator
  if (status === 'accepted') {
    dbEngine.notifications.create({
      user_id: updated.creator_id,
      role: 'creator',
      title: 'Proposal Accepted! 🎉',
      message: `${updated.brand_name} accepted your pitch for "${updated.campaign_name}"!`,
      type: 'approval',
      read: false,
      action_url: `/creator/my-campaigns`,
    });
  }

  res.json({ success: true, data: updated });
});

// -----------------------------------------------------------------------------
// 7. DIRECT MESSAGES & CONVERSATIONS CONTROLLER
// -----------------------------------------------------------------------------
app.get('/api/conversations', (req: Request, res: Response) => {
  const { userId } = req.query;
  const list = dbEngine.conversations.all();
  res.json({ success: true, count: list.length, data: list });
});

app.get('/api/messages/:conversationId', (req: Request, res: Response) => {
  const conversationId = req.params.conversationId as string;
  const msgs = dbEngine.messages.findByConversation(conversationId);
  res.json({ success: true, count: msgs.length, data: msgs });
});

app.post('/api/messages/:conversationId', (req: Request, res: Response) => {
  const { senderId, senderName, senderAvatar, senderRole, text } = req.body;
  if (!text) return res.status(400).json({ error: 'Message text required' });

  const conversationId = req.params.conversationId as string;
  const newMsg = dbEngine.messages.create({
    conversation_id: conversationId,
    sender_id: senderId || 'user-1',
    sender_name: senderName || 'User',
    sender_avatar: senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    sender_role: senderRole || 'creator',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  res.status(201).json({ success: true, data: newMsg });
});

// -----------------------------------------------------------------------------
// 8. AI MATCHMAKER CALCULATION API
// -----------------------------------------------------------------------------
app.post('/api/ai/match', (req: Request, res: Response) => {
  try {
    const { brandId, creatorId, campaignId } = req.body;
    if (!brandId || !creatorId) {
      return res.status(400).json({ error: 'brandId and creatorId are required' });
    }

    const brand = dbEngine.brandProfiles.findById(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const creator = dbEngine.creatorProfiles.findById(creatorId);
    if (!creator) return res.status(404).json({ error: 'Creator not found' });

    const campaign = campaignId ? dbEngine.campaigns.findById(campaignId) : null;
    const match = calculateBrandToCreatorMatch(brand, creator, campaign);

    res.json({
      success: true,
      brand: { id: brand.id, name: brand.brand_name, sector: brand.sector_key },
      creator: { id: creator.id, name: creator.creator_name, sector: creator.primary_sector_key },
      overallScore: match.overallScore,
      verdict: match.recommendationVerdict,
      summary: match.summary,
      positiveFactors: match.positiveFactors,
      negativeFactors: match.negativeFactors,
      breakdown: match.breakdown,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI calculation error' });
  }
});

// -----------------------------------------------------------------------------
// 9. PLATFORM METRICS OVERVIEW
// -----------------------------------------------------------------------------
app.get('/api/stats/dashboard', (req: Request, res: Response) => {
  const brands = dbEngine.brandProfiles.all();
  const creators = dbEngine.creatorProfiles.all();
  const campaigns = dbEngine.campaigns.all();
  const collabs = dbEngine.collaborationRequests.all();

  res.json({
    success: true,
    totalBrands: brands.length,
    totalCreators: creators.length,
    totalCampaigns: campaigns.length,
    totalCollaborations: collabs.length,
    acceptedCollaborations: collabs.filter(c => c.status === 'accepted').length,
    systemUptime: process.uptime(),
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(`🚀 CreatorMatch AI Backend API Server listening on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`================================================================`);
});

export default app;
