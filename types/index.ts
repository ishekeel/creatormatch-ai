export type Role = 'brand' | 'creator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

export interface BrandSustainability {
  waterEmissionLiters: number;
  waterEmissionSavedLiters: number;
  diapersCount: number;
  diapersDistributed: number;
  diaperType: string;
  ecoScore: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  industry: string;
  location: string;
  operatingDuration?: string;
  establishedYear?: string;
  targetAudience: string;
  products: Product[];
  stats: {
    activeCampaigns: number;
    creatorsCollaborating: number;
    totalReach: string;
    avgEngagement: string;
    conversions: number;
    roi: string;
  };
  sustainability?: BrandSustainability;
}

export interface SocialPlatform {
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter';
  handle: string;
  url: string;
  followers: number;
  engagement: number;
}

export interface AudienceDemographics {
  ageBreakdown: { [key: string]: number };
  topLocations: string[];
  genderSplit: { male: number; female: number; other: number };
  topInterests: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'reel' | 'video' | 'meme' | 'review' | 'ugc';
  url: string;
  thumbnail: string;
  views: number;
  engagement: number;
  brandName?: string;
  featured?: boolean;
  videoUrl?: string;
  description?: string;
  date?: string;
}

export interface VerifiedCampaign {
  id: string;
  brandName: string;
  brandLogo: string;
  campaignName: string;
  badge: 'Winner 🏆' | 'Top Performer ⭐' | 'Completed';
  reach: string;
  engagement: string;
  year: string;
  testimonial?: string;
}

export interface Creator {
  id: string;
  name: string;
  email?: string;
  handle: string;
  avatar: string;
  bio: string;
  niche: string[];
  categories: string[];
  location: string;
  languages: string[];
  socialPlatforms: SocialPlatform[];
  socialUrls?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  highestFollowers?: number;
  highestFollowersDisplay?: string;
  pastBrandsWorkedWith?: string[];
  followers: number;
  followersDisplay: string;
  avgViews: string;
  engagementRate: number;
  engagementDisplay: string;
  creatorScore: number;
  creatorCredits: number;
  campaignWins: number;
  completedCampaigns: number;
  totalReach: string;
  verified: boolean;
  audience: AudienceDemographics;
  portfolio: PortfolioItem[];
  verifiedCampaigns: VerifiedCampaign[];
  sustainability?: CreatorSustainability;
}

export interface CreatorSustainability {
  waterEmissionSavedLiters: number;
  ecoScore: number;
  verifiedEcoFriendly: boolean;
}

export interface SustainabilityRecord {
  id: string;
  entityId: string;
  entityType: 'brand' | 'creator';
  waterEmissionLiters?: number;
  waterEmissionSavedLiters: number;
  diapersCount?: number;
  diapersDistributed?: number;
  notes: string;
  timestamp: string;
}

export type CampaignObjective = 'Awareness' | 'Engagement' | 'Sales' | 'Conversions' | 'Product Launch';

export interface Deliverable {
  id: string;
  type: 'Instagram Reel' | 'YouTube Short' | 'YouTube Video' | 'Instagram Story' | 'Product Review' | 'UGC Video' | 'Image Post';
  quantity: number;
  reward: number;
}

export interface CampaignGuidelines {
  contentDos: string[];
  contentDonts: string[];
  visualAesthetic: string;
  mandatoryTags: string[];
  mandatoryMentions: string[];
  promoDiscountCode?: string;
  technicalSpecs: {
    aspectRatio: string;
    resolution: string;
    audio: string;
    lighting: string;
    minDurationSeconds: number;
    maxDurationSeconds: number;
  };
  keyTalkingPoints: string[];
  brandSafetyRules: string[];
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  name: string;
  product: string;
  category: string;
  description: string;
  guidelines?: CampaignGuidelines;
  productImage: string;
  objective: CampaignObjective;
  targetAudience: {
    age: string;
    gender: string;
    location: string;
    language: string;
    interests: string[];
  };
  requirements?: {
    niche: string[];
    platforms: string[];
    minFollowers: number;
    minEngagement: number;
    location: string;
    language: string;
    budget: number;
  };
  deliverables: Deliverable[];
  timeline: {
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };
  status: 'active' | 'draft' | 'completed' | 'paused';
  budget: number;
  rewardDisplay: string;
  deadlineDisplay: string;
  invitedCreatorIds: string[];
  acceptedCreatorIds: string[];
  appliedCreatorIds: string[];
  reach: string;
  engagement: string;
  conversions: number;
}

export interface MatchBreakdown {
  audienceMatch: number;
  nicheMatch: number;
  sectorFitScore: number;
  skillFitScore: number;
  engagementQuality: number;
  locationLanguageMatch: number;
  campaignFit: number;
  pastPerformance: number;
}

export interface MatchScore {
  creatorId: string;
  brandId?: string;
  overallScore: number;
  sectorFitScore?: number;
  skillFitScore?: number;
  recommendationVerdict: 'Strong AI Match' | 'Compatible Sector' | 'Moderate Fit' | 'Low Compatibility';
  aiReasoning: string;
  positiveFactors?: string[];
  negativeFactors?: string[];
  breakdown: MatchBreakdown;
  explanation: string;
}

export type ConnectionStatus = 'not_connected' | 'pending_sent' | 'pending_received' | 'connected';

export interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: 'brand' | 'creator';
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverRole: 'brand' | 'creator';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  note?: string;
}

export interface SubmissionAiBreakdown {
  contentRelevance: number;
  brandFit: number;
  creativeQuality: number;
  originality: number;
  productVisibility: number;
  brandSafety: number;
}

export interface Submission {
  id: string;
  campaignId: string;
  campaignName: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  type: 'image' | 'video' | 'meme' | 'url';
  mediaUrl: string;
  thumbnail: string;
  caption: string;
  hashtags: string[];
  productMention: string;
  submissionDate: string;
  status: 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'published';
  aiQualityScore: number;
  aiBreakdown: SubmissionAiBreakdown;
  aiFeedback: string;
}

export interface Challenge {
  id: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  name: string;
  product: string;
  description: string;
  theme: string;
  rules: string[];
  hashtag: string;
  startDate: string;
  endDate: string;
  submissionType: string;
  prizePool: {
    first: number;
    second: number;
    third: number;
    totalDisplay: string;
  };
  creditsAward: {
    winner: number;
    top10: number;
    participation: number;
  };
  participantsCount: number;
  submissionsCount: number;
  daysRemaining: number;
  status: 'live' | 'upcoming' | 'completed';
  winnerCreatorId?: string;
}

export interface ChallengeEntry {
  id: string;
  challengeId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHandle: string;
  mediaUrl: string;
  caption: string;
  submissionType: string;
  aiScore: number;
  votes: number;
  engagement: number;
  rank: number;
  submittedAt: string;
  isWinner?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface CreatorCreditItem {
  id: string;
  creatorId: string;
  amount: number;
  type: 'earned' | 'redeemed';
  description: string;
  date: string;
  badge?: string;
  source: 'campaign_completed' | 'challenge_participation' | 'top_10' | 'challenge_winner' | 'high_performance' | 'bonus';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: Role;
  text: string;
  timestamp: string;
}

export interface CampaignApplication {
  id: string;
  campaignId: string;
  campaignName: string;
  brandId: string;
  brandName: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  deliverableType: string;
  pitchVideoUrl?: string;
  pitchVideoTitle: string;
  conceptPitch: string;
  samplePostUrl?: string;
  matchScore: number;
  status: 'pending' | 'accepted' | 'declined';
  appliedAt: string;
  notes?: string;
}

export interface Conversation {
  id: string;
  brandId?: string;
  brandName?: string;
  brandLogo?: string;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantRole: Role;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  campaignContext?: {
    id: string;
    name: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'invite' | 'approval' | 'credit' | 'win' | 'match' | 'changes' | 'system';
  date: string;
  read: boolean;
  actionUrl?: string;
}
