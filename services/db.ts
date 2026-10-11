/**
 * CreatorMatch AI - Persistent Database & Local/Supabase Storage Engine
 * Stores and manages Brands, Creators, Campaigns, Submissions, Challenges,
 * and tracks Water Emissions and Diaper inventory in a relational schema.
 */

import {
  Brand,
  Creator,
  Campaign,
  Submission,
  Challenge,
  ChallengeEntry,
  Achievement,
  CreatorCreditItem,
  Message,
  NotificationItem,
  SustainabilityRecord,
  Role,
  PortfolioItem,
  ConnectionRequest,
  ConnectionStatus,
  CampaignApplication,
  Conversation,
} from '@/types';
import { mockBrands } from '@/data/brands';
import { mockCreators } from '@/data/creators';
import { mockCampaigns } from '@/data/campaigns';
import { mockChallenges, mockChallengeEntries } from '@/data/challenges';
import { mockAchievements, mockInitialCredits } from '@/data/achievements';

export interface UserCredential {
  id: string;
  email: string;
  password: string;
  role: Role;
  entityId: string;
  name: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  role: Role;
  entityId: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

const DB_KEYS = {
  BRANDS: 'creatormatch_db_brands_v1',
  CREATORS: 'creatormatch_db_creators_v1',
  CAMPAIGNS: 'creatormatch_db_campaigns_v1',
  SUBMISSIONS: 'creatormatch_db_submissions_v1',
  CHALLENGES: 'creatormatch_db_challenges_v1',
  ENTRIES: 'creatormatch_db_entries_v1',
  CREDITS: 'creatormatch_db_credits_v1',
  ACHIEVEMENTS: 'creatormatch_db_achievements_v1',
  MESSAGES: 'creatormatch_db_messages_v1',
  CONVERSATIONS: 'creatormatch_db_conversations_v1',
  NOTIFICATIONS: 'creatormatch_db_notifications_v1',
  SUSTAINABILITY: 'creatormatch_db_sustainability_v1',
  ACTIVE_ROLE: 'creatormatch_db_role_v1',
  CONNECTIONS: 'creatormatch_db_connections_v1',
  APPLICATIONS: 'creatormatch_db_applications_v1',
  AUTH_SESSION: 'creatormatch_db_session_v2',
  AUTH_CREDENTIALS: 'creatormatch_db_credentials_v2',
};

function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed reading db key ${key}:`, err);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed saving db key ${key}:`, err);
  }
}

export const mockInitialConnections: ConnectionRequest[] = [];
export const mockInitialApplications: CampaignApplication[] = [];


export const db = {
  // --- INITIALIZATION ---
  initDatabase(): void {
    if (typeof window === 'undefined') return;

    // Purge any stale client localStorage cache from previous builds
    const currentVersion = localStorage.getItem('creatormatch_db_version');
    if (currentVersion !== 'v4_clean') {
      localStorage.removeItem(DB_KEYS.BRANDS);
      localStorage.removeItem(DB_KEYS.CREATORS);
      localStorage.removeItem(DB_KEYS.CAMPAIGNS);
      localStorage.removeItem(DB_KEYS.APPLICATIONS);
      localStorage.removeItem(DB_KEYS.CONNECTIONS);
      localStorage.removeItem(DB_KEYS.MESSAGES);
      localStorage.removeItem(DB_KEYS.NOTIFICATIONS);
      localStorage.removeItem(DB_KEYS.SUSTAINABILITY);
      localStorage.setItem('creatormatch_db_version', 'v4_clean');
    }

    if (!localStorage.getItem(DB_KEYS.BRANDS)) {
      safeSetItem(DB_KEYS.BRANDS, []);
    }
    if (!localStorage.getItem(DB_KEYS.CREATORS)) {
      safeSetItem(DB_KEYS.CREATORS, []);
    }
    if (!localStorage.getItem(DB_KEYS.CAMPAIGNS)) {
      safeSetItem(DB_KEYS.CAMPAIGNS, []);
    }
    if (!localStorage.getItem(DB_KEYS.APPLICATIONS)) {
      safeSetItem(DB_KEYS.APPLICATIONS, []);
    }
    if (!localStorage.getItem(DB_KEYS.CHALLENGES)) {
      safeSetItem(DB_KEYS.CHALLENGES, []);
    }
    if (!localStorage.getItem(DB_KEYS.ENTRIES)) {
      safeSetItem(DB_KEYS.ENTRIES, {});
    }
    if (!localStorage.getItem(DB_KEYS.CREDITS)) {
      safeSetItem(DB_KEYS.CREDITS, []);
    }
    if (!localStorage.getItem(DB_KEYS.ACHIEVEMENTS)) {
      safeSetItem(DB_KEYS.ACHIEVEMENTS, mockAchievements);
    }
    if (!localStorage.getItem(DB_KEYS.SUSTAINABILITY)) {
      safeSetItem(DB_KEYS.SUSTAINABILITY, []);
    }
    if (!localStorage.getItem(DB_KEYS.CONNECTIONS)) {
      safeSetItem(DB_KEYS.CONNECTIONS, []);
    }
  },

  // --- BRANDS ---
  getBrands(): Brand[] {
    return safeGetItem<Brand[]>(DB_KEYS.BRANDS, []);
  },

  getBrand(id: string): Brand | undefined {
    return this.getBrands().find(b => b.id === id);
  },

  saveBrand(updatedBrand: Brand): void {
    const list = this.getBrands().map(b => (b.id === updatedBrand.id ? updatedBrand : b));
    safeSetItem(DB_KEYS.BRANDS, list);
  },

  addBrand(newBrand: Brand): void {
    const list = this.getBrands();
    const updated = [newBrand, ...list.filter(b => b.id !== newBrand.id)];
    safeSetItem(DB_KEYS.BRANDS, updated);
  },

  /**
   * Updates water emission and diapers metrics for a brand in database
   */
  updateBrandSustainability(
    brandId: string,
    data: {
      waterEmissionLiters?: number;
      waterEmissionSavedLiters?: number;
      diapersCount?: number;
      diapersDistributed?: number;
      diaperType?: string;
      ecoScore?: number;
      notes?: string;
    }
  ): Brand | undefined {
    const brands = this.getBrands();
    const target = brands.find(b => b.id === brandId);
    if (!target) return undefined;

    const prevSust = target.sustainability || {
      waterEmissionLiters: 12000,
      waterEmissionSavedLiters: 0,
      diapersCount: 0,
      diapersDistributed: 0,
      diaperType: 'Standard Eco Diapers',
      ecoScore: 80,
    };

    const newSust = {
      waterEmissionLiters: data.waterEmissionLiters ?? prevSust.waterEmissionLiters,
      waterEmissionSavedLiters: data.waterEmissionSavedLiters ?? prevSust.waterEmissionSavedLiters,
      diapersCount: data.diapersCount ?? prevSust.diapersCount,
      diapersDistributed: data.diapersDistributed ?? prevSust.diapersDistributed,
      diaperType: data.diaperType ?? prevSust.diaperType,
      ecoScore: data.ecoScore ?? prevSust.ecoScore,
    };

    const updated: Brand = {
      ...target,
      sustainability: newSust,
    };

    safeSetItem(
      DB_KEYS.BRANDS,
      brands.map(b => (b.id === brandId ? updated : b))
    );

    // Audit record
    this.addSustainabilityRecord({
      id: `sust-${Date.now()}`,
      entityId: brandId,
      entityType: 'brand',
      waterEmissionLiters: newSust.waterEmissionLiters,
      waterEmissionSavedLiters: newSust.waterEmissionSavedLiters,
      diapersCount: newSust.diapersCount,
      diapersDistributed: newSust.diapersDistributed,
      notes: data.notes || `Updated diapers (${newSust.diapersCount}) and water footprint (${newSust.waterEmissionSavedLiters}L saved)`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  },

  // --- CREATORS ---
  getCreators(): Creator[] {
    return safeGetItem<Creator[]>(DB_KEYS.CREATORS, []);
  },

  getCreator(id: string): Creator | undefined {
    return this.getCreators().find(c => c.id === id);
  },

  saveCreator(updatedCreator: Creator): void {
    const list = this.getCreators().map(c => (c.id === updatedCreator.id ? updatedCreator : c));
    safeSetItem(DB_KEYS.CREATORS, list);
  },

  addCreator(newCreator: Creator): void {
    const list = this.getCreators();
    const updated = [newCreator, ...list.filter(c => c.id !== newCreator.id)];
    safeSetItem(DB_KEYS.CREATORS, updated);
  },

  addPortfolioItem(creatorId: string, item: PortfolioItem): Creator | undefined {
    const creators = this.getCreators();
    const target = creators.find(c => c.id === creatorId);
    if (!target) return undefined;
    const updated: Creator = {
      ...target,
      portfolio: [item, ...target.portfolio],
    };
    safeSetItem(DB_KEYS.CREATORS, creators.map(c => c.id === creatorId ? updated : c));
    return updated;
  },

  /**
   * Updates water emission savings for a content creator in database
   */
  updateCreatorSustainability(
    creatorId: string,
    data: {
      waterEmissionSavedLiters: number;
      ecoScore?: number;
      verifiedEcoFriendly?: boolean;
      notes?: string;
    }
  ): Creator | undefined {
    const creators = this.getCreators();
    const target = creators.find(c => c.id === creatorId);
    if (!target) return undefined;

    const prevSust = target.sustainability || {
      waterEmissionSavedLiters: 0,
      ecoScore: 80,
      verifiedEcoFriendly: false,
    };

    const newSust = {
      waterEmissionSavedLiters: data.waterEmissionSavedLiters,
      ecoScore: data.ecoScore ?? prevSust.ecoScore,
      verifiedEcoFriendly: data.verifiedEcoFriendly ?? prevSust.verifiedEcoFriendly,
    };

    const updated: Creator = {
      ...target,
      sustainability: newSust,
    };

    safeSetItem(
      DB_KEYS.CREATORS,
      creators.map(c => (c.id === creatorId ? updated : c))
    );

    this.addSustainabilityRecord({
      id: `sust-${Date.now()}`,
      entityId: creatorId,
      entityType: 'creator',
      waterEmissionSavedLiters: data.waterEmissionSavedLiters,
      notes: data.notes || `Logged creator water savings impact: ${data.waterEmissionSavedLiters} Liters`,
      timestamp: new Date().toISOString(),
    });

    return updated;
  },

  // --- SUSTAINABILITY AUDIT TRAIL ---
  getSustainabilityRecords(): SustainabilityRecord[] {
    return safeGetItem<SustainabilityRecord[]>(DB_KEYS.SUSTAINABILITY, []);
  },

  addSustainabilityRecord(record: SustainabilityRecord): void {
    const list = this.getSustainabilityRecords();
    safeSetItem(DB_KEYS.SUSTAINABILITY, [record, ...list]);
  },

  // --- CAMPAIGNS ---
  getCampaigns(): Campaign[] {
    return safeGetItem<Campaign[]>(DB_KEYS.CAMPAIGNS, []);
  },

  saveCampaign(campaign: Campaign): void {
    const list = this.getCampaigns();
    safeSetItem(DB_KEYS.CAMPAIGNS, [campaign, ...list]);
  },

  updateCampaign(campaignId: string, patch: Partial<Campaign>): void {
    const list = this.getCampaigns().map(c => (c.id === campaignId ? { ...c, ...patch } : c));
    safeSetItem(DB_KEYS.CAMPAIGNS, list);
  },

  // --- SUBMISSIONS ---
  getSubmissions(): Submission[] {
    return safeGetItem<Submission[]>(DB_KEYS.SUBMISSIONS, []);
  },

  saveSubmission(submission: Submission): void {
    const list = this.getSubmissions();
    safeSetItem(DB_KEYS.SUBMISSIONS, [submission, ...list]);
  },

  updateSubmission(id: string, patch: Partial<Submission>): void {
    const list = this.getSubmissions().map(s => (s.id === id ? { ...s, ...patch } : s));
    safeSetItem(DB_KEYS.SUBMISSIONS, list);
  },

  // --- CHALLENGES & ENTRIES ---
  getChallenges(): Challenge[] {
    return safeGetItem<Challenge[]>(DB_KEYS.CHALLENGES, mockChallenges);
  },

  saveChallenge(challenge: Challenge): void {
    const list = this.getChallenges();
    safeSetItem(DB_KEYS.CHALLENGES, [challenge, ...list]);
  },

  getChallengeEntries(): Record<string, ChallengeEntry[]> {
    return safeGetItem<Record<string, ChallengeEntry[]>>(DB_KEYS.ENTRIES, mockChallengeEntries);
  },

  getEntriesForChallenge(challengeId: string): ChallengeEntry[] {
    const all = this.getChallengeEntries();
    return all[challengeId] || [];
  },

  saveChallengeEntry(challengeId: string, entry: ChallengeEntry): void {
    const all = this.getChallengeEntries();
    const existing = all[challengeId] || [];
    const updated = [entry, ...existing.map(e => ({ ...e, rank: e.rank + 1 }))];
    safeSetItem(DB_KEYS.ENTRIES, { ...all, [challengeId]: updated });
  },

  upvoteChallengeEntry(entryId: string): boolean {
    const all = this.getChallengeEntries();
    let updated = false;
    const nextAll: Record<string, ChallengeEntry[]> = {};
    for (const [cId, entries] of Object.entries(all)) {
      nextAll[cId] = entries.map(e => {
        if (e.id === entryId) {
          updated = true;
          return { ...e, votes: e.votes + 1 };
        }
        return e;
      });
    }
    if (updated) {
      safeSetItem(DB_KEYS.ENTRIES, nextAll);
    }
    return updated;
  },

  awardChallengeWinner(challengeId: string, winnerCreatorId: string): boolean {
    const challenges = this.getChallenges();
    const updatedChallenges = challenges.map(c =>
      c.id === challengeId ? { ...c, status: 'completed' as const } : c
    );
    safeSetItem(DB_KEYS.CHALLENGES, updatedChallenges);
    this.addCredit({
      id: `cred-${Date.now()}`,
      creatorId: winnerCreatorId,
      amount: 500,
      type: 'earned',
      description: 'Won Creative Challenge 🏆',
      source: 'challenge_winner',
      date: new Date().toISOString(),
    });
    return true;
  },

  // --- CREDITS & ACHIEVEMENTS ---
  getCredits(): CreatorCreditItem[] {
    return safeGetItem<CreatorCreditItem[]>(DB_KEYS.CREDITS, mockInitialCredits);
  },

  addCredit(item: CreatorCreditItem): void {
    const list = this.getCredits();
    safeSetItem(DB_KEYS.CREDITS, [item, ...list]);
  },

  getAchievements(): Achievement[] {
    return safeGetItem<Achievement[]>(DB_KEYS.ACHIEVEMENTS, mockAchievements);
  },

  saveAchievements(list: Achievement[]): void {
    safeSetItem(DB_KEYS.ACHIEVEMENTS, list);
  },

  // --- ACTIVE ROLE ---
  getActiveRole(): Role {
    return safeGetItem<Role>(DB_KEYS.ACTIVE_ROLE, 'brand');
  },

  setActiveRole(role: Role): void {
    safeSetItem(DB_KEYS.ACTIVE_ROLE, role);
  },

  // --- CONNECTIONS (LinkedIn-Style Verified Networking) ---
  getConnections(): ConnectionRequest[] {
    return safeGetItem<ConnectionRequest[]>(DB_KEYS.CONNECTIONS, mockInitialConnections);
  },

  sendConnectionRequest(req: Omit<ConnectionRequest, 'id' | 'createdAt' | 'status'>): ConnectionRequest {
    const list = this.getConnections();
    const newReq: ConnectionRequest = {
      ...req,
      id: `conn-${Date.now()}`,
      status: 'pending',
      createdAt: 'Just now',
    };
    safeSetItem(DB_KEYS.CONNECTIONS, [newReq, ...list]);
    return newReq;
  },

  acceptConnectionRequest(requestId: string): boolean {
    const list = this.getConnections();
    const updated = list.map(c => c.id === requestId ? { ...c, status: 'accepted' as const } : c);
    safeSetItem(DB_KEYS.CONNECTIONS, updated);
    return true;
  },

  declineConnectionRequest(requestId: string): boolean {
    const list = this.getConnections();
    const updated = list.filter(c => c.id !== requestId);
    safeSetItem(DB_KEYS.CONNECTIONS, updated);
    return true;
  },

  getConnectionStatus(userAId: string, userBId: string): ConnectionStatus {
    const list = this.getConnections();
    const conn = list.find(
      c => (c.senderId === userAId && c.receiverId === userBId) ||
           (c.senderId === userBId && c.receiverId === userAId)
    );
    if (!conn) return 'not_connected';
    if (conn.status === 'accepted') return 'connected';
    if (conn.senderId === userAId) return 'pending_sent';
    return 'pending_received';
  },

  // --- CAMPAIGN APPLICATIONS & PITCH VIDEOS ---
  getCampaignApplications(campaignId?: string, brandId?: string): CampaignApplication[] {
    const list = safeGetItem<CampaignApplication[]>(DB_KEYS.APPLICATIONS, mockInitialApplications);
    return list.filter(app => {
      if (campaignId && app.campaignId !== campaignId) return false;
      if (brandId && app.brandId !== brandId) return false;
      return true;
    });
  },

  addCampaignApplication(app: CampaignApplication): void {
    const list = safeGetItem<CampaignApplication[]>(DB_KEYS.APPLICATIONS, mockInitialApplications);
    safeSetItem(DB_KEYS.APPLICATIONS, [app, ...list.filter(a => a.id !== app.id)]);
  },

  updateCampaignApplicationStatus(id: string, status: 'accepted' | 'declined'): boolean {
    const list = safeGetItem<CampaignApplication[]>(DB_KEYS.APPLICATIONS, mockInitialApplications);
    const updated = list.map(a => (a.id === id ? { ...a, status } : a));
    safeSetItem(DB_KEYS.APPLICATIONS, updated);
    return true;
  },

  // --- CONVERSATIONS & DIRECT MESSAGES ---
  getConversations(): Conversation[] {
    return safeGetItem<Conversation[]>(DB_KEYS.CONVERSATIONS, []);
  },

  saveConversation(conv: Conversation): Conversation {
    const list = this.getConversations();
    const idx = list.findIndex(c => c.id === conv.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...conv };
      safeSetItem(DB_KEYS.CONVERSATIONS, list);
      return list[idx];
    } else {
      const updated = [conv, ...list];
      safeSetItem(DB_KEYS.CONVERSATIONS, updated);
      return conv;
    }
  },

  getMessages(): Record<string, Message[]> {
    return safeGetItem<Record<string, Message[]>>(DB_KEYS.MESSAGES, {});
  },

  getConversationMessages(conversationId: string): Message[] {
    const all = this.getMessages();
    return all[conversationId] || [];
  },

  saveMessage(conversationId: string, message: Message): Message {
    const all = this.getMessages();
    const current = all[conversationId] || [];
    all[conversationId] = [...current, message];
    safeSetItem(DB_KEYS.MESSAGES, all);
    return message;
  },

  // --- RESET DATABASE ---
  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DB_KEYS.BRANDS);
    localStorage.removeItem(DB_KEYS.CREATORS);
    localStorage.removeItem(DB_KEYS.CAMPAIGNS);
    localStorage.removeItem(DB_KEYS.SUBMISSIONS);
    localStorage.removeItem(DB_KEYS.CHALLENGES);
    localStorage.removeItem(DB_KEYS.ENTRIES);
    localStorage.removeItem(DB_KEYS.CREDITS);
    localStorage.removeItem(DB_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(DB_KEYS.SUSTAINABILITY);
    localStorage.removeItem(DB_KEYS.CONNECTIONS);
    localStorage.removeItem(DB_KEYS.CONVERSATIONS);
    localStorage.removeItem(DB_KEYS.MESSAGES);
    this.initDatabase();
  },

  // --- SUPABASE POSTGRES EXPORT ---
  getSupabaseSchemaSQL(): string {
    return `-- ===============================================================
-- CreatorMatch AI - Supabase PostgreSQL Schema
-- Includes Brands, Creators, Campaigns, and Sustainability Metrics
-- ===============================================================

-- 1. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    description TEXT,
    website TEXT,
    industry TEXT,
    location TEXT,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Brand Sustainability & Diaper Inventory Table
CREATE TABLE IF NOT EXISTS public.brand_sustainability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id TEXT REFERENCES public.brands(id) ON DELETE CASCADE,
    water_emission_liters NUMERIC DEFAULT 0,
    water_emission_saved_liters NUMERIC DEFAULT 0,
    diapers_count INTEGER DEFAULT 0,
    diapers_distributed INTEGER DEFAULT 0,
    diaper_type TEXT,
    eco_score INTEGER DEFAULT 90,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Creators Table
CREATE TABLE IF NOT EXISTS public.creators (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    handle TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    niche TEXT[],
    categories TEXT[],
    location TEXT,
    languages TEXT[],
    followers INTEGER DEFAULT 0,
    engagement_rate NUMERIC DEFAULT 0,
    creator_score INTEGER DEFAULT 90,
    creator_credits INTEGER DEFAULT 0,
    campaign_wins INTEGER DEFAULT 0,
    completed_campaigns INTEGER DEFAULT 0,
    total_reach TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Creator Sustainability Table (Water Emissions Offset)
CREATE TABLE IF NOT EXISTS public.creator_sustainability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id TEXT REFERENCES public.creators(id) ON DELETE CASCADE,
    water_emission_saved_liters NUMERIC DEFAULT 0,
    eco_score INTEGER DEFAULT 90,
    verified_eco_friendly BOOLEAN DEFAULT false,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Campaigns Table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    brand_id TEXT REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    product TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    product_image TEXT,
    objective TEXT NOT NULL,
    budget NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Content Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    campaign_id TEXT REFERENCES public.campaigns(id),
    creator_id TEXT REFERENCES public.creators(id),
    type TEXT NOT NULL,
    media_url TEXT,
    caption TEXT,
    product_mention TEXT,
    ai_quality_score INTEGER DEFAULT 90,
    status TEXT DEFAULT 'under_review',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Creative Meme Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    brand_id TEXT REFERENCES public.brands(id),
    name TEXT NOT NULL,
    product TEXT,
    theme TEXT,
    hashtag TEXT,
    status TEXT DEFAULT 'live',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Sustainability Audit Trail
CREATE TABLE IF NOT EXISTS public.sustainability_audit_logs (
    id TEXT PRIMARY KEY,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    water_emission_liters NUMERIC,
    water_emission_saved_liters NUMERIC NOT NULL,
    diapers_count INTEGER,
    diapers_distributed INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;
  },

  // --- AUTHENTICATION & SESSION PERSISTENCE ---
  getCredentials(): UserCredential[] {
    const defaultCreds: UserCredential[] = [
      { id: 'cred-1', email: 'calvin@creatormatch.ai', password: 'password123', role: 'brand', entityId: 'brand-calvin', name: 'Calvin Fashion' },
      { id: 'cred-2', email: 'glowrush@creatormatch.ai', password: 'password123', role: 'brand', entityId: 'brand-glowrush', name: 'GlowRush Cosmetics' },
      { id: 'cred-3', email: 'hello@freshplategourmet.in', password: 'password123', role: 'brand', entityId: 'brand-freshplate', name: 'FreshPlate Gourmet' },
      { id: 'cred-4', email: 'apex@creatormatch.ai', password: 'password123', role: 'brand', entityId: 'brand-apexgaming', name: 'Apex Gaming' },
      { id: 'cred-5', email: 'maya@creatormatch.ai', password: 'password123', role: 'creator', entityId: 'creator-maya', name: 'Maya Patel' },
      { id: 'cred-6', email: 'maya@patel.io', password: 'password123', role: 'creator', entityId: 'creator-maya', name: 'Maya Patel' },
      { id: 'cred-7', email: 'ananya@creatormatch.ai', password: 'password123', role: 'creator', entityId: 'creator-ananya', name: 'Ananya Rao' },
      { id: 'cred-8', email: 'kabir@culinarysen.com', password: 'password123', role: 'creator', entityId: 'creator-kabir', name: 'Chef Kabir Sen' },
      { id: 'cred-9', email: 'viper@esports.gg', password: 'password123', role: 'creator', entityId: 'creator-viper', name: 'Karan Viper' },
    ];
    return safeGetItem<UserCredential[]>(DB_KEYS.AUTH_CREDENTIALS, defaultCreds);
  },

  saveCredential(cred: UserCredential): void {
    const list = this.getCredentials();
    const filtered = list.filter(c => c.email.toLowerCase() !== cred.email.toLowerCase());
    safeSetItem(DB_KEYS.AUTH_CREDENTIALS, [...filtered, cred]);
  },

  findCredential(email: string): UserCredential | undefined {
    return this.getCredentials().find(c => c.email.toLowerCase() === email.toLowerCase());
  },

  getSession(): AuthSession | null {
    return safeGetItem<AuthSession | null>(DB_KEYS.AUTH_SESSION, null);
  },

  saveSession(session: AuthSession | null): void {
    safeSetItem(DB_KEYS.AUTH_SESSION, session);
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DB_KEYS.AUTH_SESSION);
    }
  },
};
