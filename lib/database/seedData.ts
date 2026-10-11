/**
 * Comprehensive Database Types & Pure Empty Initial State
 * Ready for Real Dynamic User Sign-ups and Database Persistence
 */

export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  role: 'brand' | 'creator';
  name: string;
  avatar: string;
  last_login_at?: string;
  is_logged_in?: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbBrandProfile {
  id: string;
  user_id: string;
  brand_name: string;
  logo: string;
  description: string;
  industry: string;
  sector_key: string;
  location: string;
  operating_duration: string;
  established_year: string;
  website: string;
  products: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    image: string;
  }>;
  target_audience: {
    age: string;
    gender: string;
    location: string;
    interests: string[];
    description: string;
  };
  preferred_platforms: string[];
  preferred_creator_categories: string[];
  budget_range: string;
  stats: {
    active_campaigns: number;
    creators_collaborating: number;
    total_reach: string;
    avg_engagement: string;
    conversions: number;
    roi: string;
  };
  sustainability?: {
    water_emission_liters: number;
    water_emission_saved_liters: number;
    diapers_count: number;
    diapers_distributed: number;
    diaper_type: string;
    eco_score: number;
  };
  created_at: string;
  updated_at: string;
}

export interface DbCreatorProfile {
  id: string;
  user_id: string;
  creator_name: string;
  handle: string;
  avatar: string;
  email: string;
  bio: string;
  niche: string[];
  primary_sector_key: string;
  categories: string[];
  content_types: string[];
  location: string;
  languages: string[];
  social_platforms: Array<{
    platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'twitch';
    handle: string;
    url: string;
    followers: number;
    engagement: number;
  }>;
  followers: number;
  followers_display: string;
  avg_views: string;
  engagement_rate: number;
  engagement_display: string;
  creator_score: number;
  creator_credits: number;
  campaign_wins?: number;
  campaignWins?: number;
  completed_campaigns: number;
  total_reach: string;
  verified: boolean;
  audience_demographics: {
    age_breakdown: Record<string, number>;
    gender_split: { female: number; male: number; other: number };
    top_locations: string[];
    top_interests: string[];
  };
  portfolio: Array<{
    id: string;
    title: string;
    type: 'reel' | 'video' | 'review' | 'ugc' | 'meme' | 'post';
    url: string;
    thumbnail: string;
    views: number;
    engagement: number;
    brand_name?: string;
    featured?: boolean;
  }>;
  skills: string[];
  past_brands_worked_with: string[];
  preferred_brand_categories: string[];
  collaboration_preferences: {
    min_budget: number;
    preferred_deliverables: string[];
    open_to_gifting: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface DbCampaign {
  id: string;
  brand_id: string;
  brand_name: string;
  brand_logo: string;
  name: string;
  product: string;
  category: string;
  sector_key: string;
  description: string;
  product_image: string;
  objective: string;
  target_audience: {
    age: string;
    gender: string;
    location: string;
    language: string;
    interests: string[];
  };
  required_platforms: string[];
  deliverables: Array<{
    id: string;
    type: string;
    quantity: number;
    reward: number;
  }>;
  guidelines?: {
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
  };
  timeline: {
    startDate: string;
    endDate: string;
    submissionDeadline: string;
  };
  budget: number;
  reward_display: string;
  deadline_display: string;
  invited_creator_ids: string[];
  accepted_creator_ids: string[];
  applied_creator_ids: string[];
  status: 'active' | 'draft' | 'completed' | 'paused';
  reach: string;
  engagement: string;
  conversions: number;
  created_at: string;
  updated_at: string;
}

export interface DbMatch {
  id: string;
  brand_id: string;
  creator_id: string;
  campaign_id: string | null;
  match_score: number;
  recommendation_verdict: string;
  positive_factors: string[];
  negative_factors: string[];
  matched_categories: string[];
  breakdown: {
    sector_fit: number;
    skill_fit: number;
    audience_fit: number;
    platform_fit: number;
    engagement_fit: number;
    location_fit: number;
    past_experience_fit: number;
  };
  ai_reasoning: string;
  generated_at: string;
}

export interface DbCollaborationRequest {
  id: string;
  sender_id: string;
  sender_role: 'brand' | 'creator';
  receiver_id: string;
  receiver_role: 'brand' | 'creator';
  brand_id: string;
  brand_name: string;
  brand_logo: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  campaign_id: string | null;
  campaign_name: string | null;
  deliverable_type: string;
  pitch_video_url: string | null;
  pitch_video_title: string | null;
  concept_pitch: string | null;
  match_score: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  created_at: string;
  updated_at: string;
}

export interface DbSavedItem {
  id: string;
  entity_type: 'creator' | 'brand';
  owner_id: string;
  target_id: string;
  created_at: string;
}

export interface DbNotification {
  id: string;
  user_id: string;
  role: 'brand' | 'creator';
  title: string;
  message: string;
  type: 'match' | 'invite' | 'request' | 'approval' | 'message' | 'system';
  read: boolean;
  action_url: string | null;
  created_at: string;
}

export interface DbConversation {
  id: string;
  creator_id: string;
  brand_id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar: string;
  participant_role: 'brand' | 'creator';
  last_message: string;
  last_message_time: string;
  unread_count: number;
  campaign_context?: {
    id: string;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  sender_role: 'brand' | 'creator';
  text: string;
  timestamp: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// INITIAL SEED ARRAYS - Clean, 100% Dynamic Database Ready
// ---------------------------------------------------------------------------
export const initialUsers: DbUser[] = [];
export const initialBrandProfiles: DbBrandProfile[] = [];
export const initialCreatorProfiles: DbCreatorProfile[] = [];
export const initialCampaigns: DbCampaign[] = [];
