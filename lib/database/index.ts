import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient';
import {
  DbUser,
  DbBrandProfile,
  DbCreatorProfile,
  DbCampaign,
  DbMatch,
  DbCollaborationRequest,
  DbSavedItem,
  DbNotification,
  DbConversation,
  DbMessage,
} from './seedData';

async function syncRecordToSupabase(table: string, record: any): Promise<{ data: any; error: any }> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { data: null, error: new Error('Supabase client unavailable') };

    const { data, error } = await supabase.from(table).upsert(record).select();
    if (error) {
      console.error(`[Supabase Sync ERROR] table="${table}":`, error.message, error.details);
      return { data: null, error };
    }
    console.log(`[Supabase Sync SUCCESS] table="${table}" id="${record?.id}"`);
    return { data, error: null };
  } catch (err: any) {
    console.error(`[Supabase Sync EXCEPTION] table="${table}":`, err.message);
    return { data: null, error: err };
  }
}

export interface DatabaseSchema {
  version: number;
  users: DbUser[];
  brand_profiles: DbBrandProfile[];
  creator_profiles: DbCreatorProfile[];
  campaigns: DbCampaign[];
  matches: DbMatch[];
  collaboration_requests: DbCollaborationRequest[];
  saved_creators: DbSavedItem[];
  saved_brands: DbSavedItem[];
  notifications: DbNotification[];
  conversations: DbConversation[];
  messages: DbMessage[];
}

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'database.json');

class RelationalDatabaseEngine {
  private schema: DatabaseSchema;
  private isLoaded = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.schema = this.getEmptySchema();
    this.init();
  }

  private getEmptySchema(): DatabaseSchema {
    return {
      version: 2,
      users: [],
      brand_profiles: [],
      creator_profiles: [],
      campaigns: [],
      matches: [],
      collaboration_requests: [],
      saved_creators: [],
      saved_brands: [],
      notifications: [],
      conversations: [],
      messages: [],
    };
  }

  private init() {
    if (this.isLoaded) return;

    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          this.schema = { ...this.getEmptySchema(), ...parsed };
          this.isLoaded = true;
        }
      }
    } catch (err) {
      console.warn('[DB Engine] Could not read existing database file, resetting empty schema:', err);
      this.schema = this.getEmptySchema();
    }

    // Trigger async sync from Supabase
    this.initPromise = this.loadFromSupabase();
  }

  public async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  public async loadFromSupabase(): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) return;

      const [usersRes, brandsRes, creatorsRes, campsRes, collabsRes, notifsRes] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('brand_profiles').select('*'),
        supabase.from('creator_profiles').select('*'),
        supabase.from('campaigns').select('*'),
        supabase.from('collaboration_requests').select('*'),
        supabase.from('notifications').select('*'),
      ]);

      if (usersRes.data) {
        this.schema.users = usersRes.data.map((u: any) => ({
          id: u.id,
          email: u.email,
          password_hash: u.password_hash,
          role: u.role,
          name: u.name,
          avatar: u.avatar || '',
          is_logged_in: u.is_logged_in !== undefined ? u.is_logged_in : false,
          last_login_at: u.last_login_at || undefined,
          created_at: u.created_at,
          updated_at: u.updated_at,
        }));
      }

      if (brandsRes.data) {
        this.schema.brand_profiles = brandsRes.data.map((b: any) => ({
          id: b.id,
          user_id: b.user_id,
          brand_name: b.brand_name,
          logo: b.logo || '',
          description: b.description || '',
          industry: b.industry || 'General',
          sector_key: (b.industry || 'general').toLowerCase(),
          location: b.location || '',
          operating_duration: b.operating_duration || '1 Year',
          established_year: '2024',
          website: b.website || '',
          products: b.products || [],
          target_audience: {
            age: '18-34',
            gender: 'All',
            location: b.location || 'India',
            interests: [],
            description: typeof b.target_audience === 'object' ? b.target_audience?.description || '' : b.target_audience || '',
          },
          preferred_platforms: ['Instagram', 'YouTube'],
          preferred_creator_categories: [],
          budget_range: '₹50,000 - ₹2,00,000',
          stats: {
            active_campaigns: 0,
            creators_collaborating: 0,
            total_reach: '0K',
            avg_engagement: '0%',
            conversions: 0,
            roi: '0x',
          },
          sustainability: {
            water_emission_liters: Number(b.water_emission_liters) || 0,
            water_emission_saved_liters: Number(b.water_emission_saved_liters) || 0,
            diapers_count: Number(b.diapers_distributed) || 0,
            diapers_distributed: Number(b.diapers_distributed) || 0,
            diaper_type: '',
            eco_score: Number(b.eco_score) || 80,
          },
          created_at: b.created_at,
          updated_at: b.updated_at,
        }));
      }

      if (creatorsRes.data) {
        this.schema.creator_profiles = creatorsRes.data.map((c: any) => ({
          id: c.id,
          user_id: c.user_id,
          creator_name: c.creator_name,
          handle: c.handle,
          avatar: c.avatar || '',
          email: '',
          bio: c.bio || '',
          niche: c.niche || [],
          primary_sector_key: (c.niche?.[0] || 'lifestyle').toLowerCase(),
          categories: c.categories || [],
          content_types: ['Reels'],
          location: c.location || '',
          languages: c.languages || ['English'],
          social_platforms: c.social_urls
            ? [{ platform: 'instagram', handle: c.handle, url: c.social_urls?.instagram || '', followers: Number(c.highest_followers) || 0, engagement: Number(c.engagement_rate) || 0 }]
            : [],
          followers: Number(c.highest_followers) || 0,
          followers_display: c.highest_followers_display || '0',
          avg_views: '0',
          engagement_rate: Number(c.engagement_rate) || 0,
          engagement_display: c.engagement_display || `${c.engagement_rate || 0}%`,
          creator_score: 80,
          creator_credits: 100,
          campaign_wins: 0,
          completed_campaigns: 0,
          total_reach: c.highest_followers_display || '0',
          verified: false,
          audience_demographics: {
            age_breakdown: {},
            gender_split: { female: 50, male: 50, other: 0 },
            top_locations: [],
            top_interests: c.niche || [],
          },
          portfolio: c.portfolio || [],
          skills: [],
          past_brands_worked_with: c.past_brands || [],
          preferred_brand_categories: [],
          collaboration_preferences: {
            min_budget: 0,
            preferred_deliverables: ['Reels'],
            open_to_gifting: false,
          },
          created_at: c.created_at,
          updated_at: c.updated_at,
        }));
      }

      if (campsRes.data) {
        this.schema.campaigns = campsRes.data.map((cmp: any) => ({
          id: cmp.id,
          brand_id: cmp.brand_id,
          brand_name: cmp.brand_name,
          brand_logo: cmp.product_image || '',
          name: cmp.campaign_name,
          product: cmp.campaign_name,
          category: cmp.category || 'General',
          sector_key: (cmp.category || 'general').toLowerCase(),
          description: cmp.description || '',
          product_image: cmp.product_image || '',
          objective: 'Brand Awareness',
          target_audience: cmp.target_audience || { age: '18-34', gender: 'All', location: 'India', interests: [] },
          required_platforms: ['Instagram'],
          deliverables: cmp.deliverables || [],
          guidelines: cmp.guidelines || [],
          timeline: cmp.timeline || { startDate: '', endDate: '', submissionDeadline: '' },
          budget: Number(cmp.budget) || 0,
          reward_display: cmp.budget_display || `₹${Number(cmp.budget || 0).toLocaleString()}`,
          deadline_display: '',
          invited_creator_ids: cmp.invited_creator_ids || [],
          accepted_creator_ids: cmp.accepted_creator_ids || [],
          applied_creator_ids: cmp.applied_creator_ids || [],
          status: cmp.status || 'active',
          reach: '0K',
          engagement: '0%',
          conversions: 0,
          created_at: cmp.created_at,
          updated_at: cmp.updated_at,
        }));
      }

      if (collabsRes.data) {
        this.schema.collaboration_requests = collabsRes.data;
      }

      if (notifsRes.data) {
        this.schema.notifications = notifsRes.data;
      }

      this.persist();
      this.isLoaded = true;
      console.log(`[DB Engine] Synced with Supabase: ${this.schema.users.length} users, ${this.schema.brand_profiles.length} brands, ${this.schema.creator_profiles.length} creators, ${this.schema.campaigns.length} campaigns.`);
    } catch (err: any) {
      console.error('[DB Engine] Failed syncing with Supabase:', err.message);
    }
  }

  public seedDatabase() {
    this.schema = this.getEmptySchema();
    this.persist();
    this.isLoaded = true;
  }

  private persist() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.schema, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB Engine] Failed persisting to disk:', err);
    }
  }

  private schedulePersist() {
    this.persist();
  }

  // -------------------------------------------------------------------------
  // REPOSITORIES
  // -------------------------------------------------------------------------

  public get users() {
    return {
      all: () => [...this.schema.users],
      findById: (id: string) => this.schema.users.find(u => u.id === id) || null,
      findByEmail: (email: string) => this.schema.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null,
      create: (data: Omit<DbUser, 'created_at' | 'updated_at'>): DbUser => {
        const now = new Date().toISOString();
        const user: DbUser = {
          ...data,
          last_login_at: data.last_login_at || now,
          is_logged_in: data.is_logged_in !== undefined ? data.is_logged_in : true,
          created_at: now,
          updated_at: now,
        };

        const idx = this.schema.users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          this.schema.users[idx] = user;
        } else {
          this.schema.users.push(user);
        }
        this.schedulePersist();

        // Write directly to Supabase
        syncRecordToSupabase('users', {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
          is_logged_in: user.is_logged_in,
          last_login_at: user.last_login_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });

        return user;
      },
      createAsync: async (data: Omit<DbUser, 'created_at' | 'updated_at'>): Promise<DbUser> => {
        const now = new Date().toISOString();
        const user: DbUser = {
          ...data,
          last_login_at: data.last_login_at || now,
          is_logged_in: data.is_logged_in !== undefined ? data.is_logged_in : true,
          created_at: now,
          updated_at: now,
        };

        const idx = this.schema.users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          this.schema.users[idx] = user;
        } else {
          this.schema.users.push(user);
        }
        this.schedulePersist();

        await syncRecordToSupabase('users', {
          id: user.id,
          email: user.email,
          password_hash: user.password_hash,
          role: user.role,
          name: user.name,
          avatar: user.avatar,
          is_logged_in: user.is_logged_in,
          last_login_at: user.last_login_at,
          created_at: user.created_at,
          updated_at: user.updated_at,
        });

        return user;
      },
      update: (id: string, updates: Partial<DbUser>): DbUser | null => {
        const idx = this.schema.users.findIndex(u => u.id === id);
        if (idx === -1) return null;

        this.schema.users[idx] = {
          ...this.schema.users[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.users[idx];
        this.schedulePersist();

        syncRecordToSupabase('users', {
          id: updated.id,
          email: updated.email,
          password_hash: updated.password_hash,
          role: updated.role,
          name: updated.name,
          avatar: updated.avatar,
          is_logged_in: updated.is_logged_in !== undefined ? updated.is_logged_in : false,
          last_login_at: updated.last_login_at || null,
          created_at: updated.created_at,
          updated_at: updated.updated_at,
        });

        return updated;
      },
      updateAsync: async (id: string, updates: Partial<DbUser>): Promise<DbUser | null> => {
        const idx = this.schema.users.findIndex(u => u.id === id);
        if (idx === -1) return null;

        this.schema.users[idx] = {
          ...this.schema.users[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.users[idx];
        this.schedulePersist();

        await syncRecordToSupabase('users', {
          id: updated.id,
          email: updated.email,
          password_hash: updated.password_hash,
          role: updated.role,
          name: updated.name,
          avatar: updated.avatar,
          is_logged_in: updated.is_logged_in !== undefined ? updated.is_logged_in : false,
          last_login_at: updated.last_login_at || null,
          created_at: updated.created_at,
          updated_at: updated.updated_at,
        });

        return updated;
      },
    };
  }

  public get brandProfiles() {
    return {
      all: () => [...this.schema.brand_profiles],
      findById: (id: string) => this.schema.brand_profiles.find(b => b.id === id) || null,
      findByUserId: (userId: string) => this.schema.brand_profiles.find(b => b.user_id === userId) || null,
      create: (data: DbBrandProfile): DbBrandProfile => {
        const idx = this.schema.brand_profiles.findIndex(b => b.id === data.id);
        if (idx !== -1) {
          this.schema.brand_profiles[idx] = data;
        } else {
          this.schema.brand_profiles.push(data);
        }
        this.schedulePersist();

        syncRecordToSupabase('brand_profiles', {
          id: data.id,
          user_id: data.user_id,
          brand_name: data.brand_name,
          industry: data.industry,
          operating_duration: data.operating_duration,
          location: data.location,
          website: data.website,
          description: data.description,
          target_audience: typeof data.target_audience === 'object' ? data.target_audience?.description || '' : data.target_audience || '',
          logo: data.logo,
          cover_image: '',
          products: data.products || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      createAsync: async (data: DbBrandProfile): Promise<DbBrandProfile> => {
        const idx = this.schema.brand_profiles.findIndex(b => b.id === data.id);
        if (idx !== -1) {
          this.schema.brand_profiles[idx] = data;
        } else {
          this.schema.brand_profiles.push(data);
        }
        this.schedulePersist();

        await syncRecordToSupabase('brand_profiles', {
          id: data.id,
          user_id: data.user_id,
          brand_name: data.brand_name,
          industry: data.industry,
          operating_duration: data.operating_duration,
          location: data.location,
          website: data.website,
          description: data.description,
          target_audience: typeof data.target_audience === 'object' ? data.target_audience?.description || '' : data.target_audience || '',
          logo: data.logo,
          cover_image: '',
          products: data.products || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      update: (id: string, updates: Partial<DbBrandProfile>): DbBrandProfile | null => {
        const idx = this.schema.brand_profiles.findIndex(b => b.id === id);
        if (idx === -1) return null;

        this.schema.brand_profiles[idx] = {
          ...this.schema.brand_profiles[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.brand_profiles[idx];
        this.schedulePersist();

        syncRecordToSupabase('brand_profiles', {
          id: updated.id,
          user_id: updated.user_id,
          brand_name: updated.brand_name,
          industry: updated.industry,
          operating_duration: updated.operating_duration,
          location: updated.location,
          website: updated.website,
          description: updated.description,
          target_audience: typeof updated.target_audience === 'object' ? updated.target_audience?.description || '' : updated.target_audience || '',
          logo: updated.logo,
          cover_image: '',
          products: updated.products || [],
          water_emission_saved_liters: updated.sustainability?.water_emission_saved_liters || 0,
          diapers_distributed: updated.sustainability?.diapers_distributed || 0,
          eco_score: updated.sustainability?.eco_score || 80,
          updated_at: updated.updated_at,
        });

        return updated;
      },
      updateAsync: async (id: string, updates: Partial<DbBrandProfile>): Promise<DbBrandProfile | null> => {
        const idx = this.schema.brand_profiles.findIndex(b => b.id === id);
        if (idx === -1) return null;

        this.schema.brand_profiles[idx] = {
          ...this.schema.brand_profiles[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.brand_profiles[idx];
        this.schedulePersist();

        await syncRecordToSupabase('brand_profiles', {
          id: updated.id,
          user_id: updated.user_id,
          brand_name: updated.brand_name,
          industry: updated.industry,
          operating_duration: updated.operating_duration,
          location: updated.location,
          website: updated.website,
          description: updated.description,
          target_audience: typeof updated.target_audience === 'object' ? updated.target_audience?.description || '' : updated.target_audience || '',
          logo: updated.logo,
          cover_image: '',
          products: updated.products || [],
          water_emission_saved_liters: updated.sustainability?.water_emission_saved_liters || 0,
          diapers_distributed: updated.sustainability?.diapers_distributed || 0,
          eco_score: updated.sustainability?.eco_score || 80,
          updated_at: updated.updated_at,
        });

        return updated;
      },
    };
  }

  public get creatorProfiles() {
    return {
      all: () => [...this.schema.creator_profiles],
      findById: (id: string) => this.schema.creator_profiles.find(c => c.id === id) || null,
      findByUserId: (userId: string) => this.schema.creator_profiles.find(c => c.user_id === userId) || null,
      findByHandle: (handle: string) => this.schema.creator_profiles.find(c => c.handle.toLowerCase() === handle.toLowerCase()) || null,
      create: (data: DbCreatorProfile): DbCreatorProfile => {
        const idx = this.schema.creator_profiles.findIndex(c => c.id === data.id);
        if (idx !== -1) {
          this.schema.creator_profiles[idx] = data;
        } else {
          this.schema.creator_profiles.push(data);
        }
        this.schedulePersist();

        syncRecordToSupabase('creator_profiles', {
          id: data.id,
          user_id: data.user_id,
          creator_name: data.creator_name,
          handle: data.handle,
          avatar: data.avatar,
          bio: data.bio,
          location: data.location,
          languages: data.languages || ['English'],
          niche: data.niche || ['Lifestyle'],
          categories: data.categories || ['Reels'],
          highest_followers: data.followers || 0,
          highest_followers_display: data.followers_display || '0',
          engagement_rate: data.engagement_rate || 0,
          engagement_display: data.engagement_display || `${data.engagement_rate || 0}%`,
          social_urls: data.social_platforms && data.social_platforms[0] ? { instagram: data.social_platforms[0].url } : {},
          portfolio: data.portfolio || [],
          past_brands: data.past_brands_worked_with || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      createAsync: async (data: DbCreatorProfile): Promise<DbCreatorProfile> => {
        const idx = this.schema.creator_profiles.findIndex(c => c.id === data.id);
        if (idx !== -1) {
          this.schema.creator_profiles[idx] = data;
        } else {
          this.schema.creator_profiles.push(data);
        }
        this.schedulePersist();

        await syncRecordToSupabase('creator_profiles', {
          id: data.id,
          user_id: data.user_id,
          creator_name: data.creator_name,
          handle: data.handle,
          avatar: data.avatar,
          bio: data.bio,
          location: data.location,
          languages: data.languages || ['English'],
          niche: data.niche || ['Lifestyle'],
          categories: data.categories || ['Reels'],
          highest_followers: data.followers || 0,
          highest_followers_display: data.followers_display || '0',
          engagement_rate: data.engagement_rate || 0,
          engagement_display: data.engagement_display || `${data.engagement_rate || 0}%`,
          social_urls: data.social_platforms && data.social_platforms[0] ? { instagram: data.social_platforms[0].url } : {},
          portfolio: data.portfolio || [],
          past_brands: data.past_brands_worked_with || [],
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      update: (id: string, updates: Partial<DbCreatorProfile>): DbCreatorProfile | null => {
        const idx = this.schema.creator_profiles.findIndex(c => c.id === id);
        if (idx === -1) return null;

        this.schema.creator_profiles[idx] = {
          ...this.schema.creator_profiles[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.creator_profiles[idx];
        this.schedulePersist();

        syncRecordToSupabase('creator_profiles', {
          id: updated.id,
          user_id: updated.user_id,
          creator_name: updated.creator_name,
          handle: updated.handle,
          avatar: updated.avatar,
          bio: updated.bio,
          location: updated.location,
          languages: updated.languages || ['English'],
          niche: updated.niche || [],
          categories: updated.categories || [],
          highest_followers: updated.followers || 0,
          highest_followers_display: updated.followers_display || '0',
          engagement_rate: updated.engagement_rate || 0,
          engagement_display: updated.engagement_display || `${updated.engagement_rate || 0}%`,
          social_urls: updated.social_platforms && updated.social_platforms[0] ? { instagram: updated.social_platforms[0].url } : {},
          portfolio: updated.portfolio || [],
          past_brands: updated.past_brands_worked_with || [],
          updated_at: updated.updated_at,
        });

        return updated;
      },
      updateAsync: async (id: string, updates: Partial<DbCreatorProfile>): Promise<DbCreatorProfile | null> => {
        const idx = this.schema.creator_profiles.findIndex(c => c.id === id);
        if (idx === -1) return null;

        this.schema.creator_profiles[idx] = {
          ...this.schema.creator_profiles[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.creator_profiles[idx];
        this.schedulePersist();

        await syncRecordToSupabase('creator_profiles', {
          id: updated.id,
          user_id: updated.user_id,
          creator_name: updated.creator_name,
          handle: updated.handle,
          avatar: updated.avatar,
          bio: updated.bio,
          location: updated.location,
          languages: updated.languages || ['English'],
          niche: updated.niche || [],
          categories: updated.categories || [],
          highest_followers: updated.followers || 0,
          highest_followers_display: updated.followers_display || '0',
          engagement_rate: updated.engagement_rate || 0,
          engagement_display: updated.engagement_display || `${updated.engagement_rate || 0}%`,
          social_urls: updated.social_platforms && updated.social_platforms[0] ? { instagram: updated.social_platforms[0].url } : {},
          portfolio: updated.portfolio || [],
          past_brands: updated.past_brands_worked_with || [],
          updated_at: updated.updated_at,
        });

        return updated;
      },
    };
  }

  public get campaigns() {
    return {
      all: () => [...this.schema.campaigns],
      findById: (id: string) => this.schema.campaigns.find(c => c.id === id) || null,
      findByBrandId: (brandId: string) => this.schema.campaigns.filter(c => c.brand_id === brandId),
      create: (data: DbCampaign): DbCampaign => {
        const idx = this.schema.campaigns.findIndex(c => c.id === data.id);
        if (idx !== -1) {
          this.schema.campaigns[idx] = data;
        } else {
          this.schema.campaigns.push(data);
        }
        this.schedulePersist();

        syncRecordToSupabase('campaigns', {
          id: data.id,
          brand_id: data.brand_id,
          brand_name: data.brand_name,
          campaign_name: data.name,
          category: data.category,
          description: data.description,
          budget: data.budget,
          budget_display: data.reward_display || (data.budget ? `₹${data.budget.toLocaleString()}` : '₹0'),
          status: data.status,
          product_image: data.product_image,
          guidelines: data.guidelines || [],
          deliverables: data.deliverables || [],
          timeline: data.timeline || {},
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      createAsync: async (data: DbCampaign): Promise<DbCampaign> => {
        const idx = this.schema.campaigns.findIndex(c => c.id === data.id);
        if (idx !== -1) {
          this.schema.campaigns[idx] = data;
        } else {
          this.schema.campaigns.push(data);
        }
        this.schedulePersist();

        await syncRecordToSupabase('campaigns', {
          id: data.id,
          brand_id: data.brand_id,
          brand_name: data.brand_name,
          campaign_name: data.name,
          category: data.category,
          description: data.description,
          budget: data.budget,
          budget_display: data.reward_display || (data.budget ? `₹${data.budget.toLocaleString()}` : '₹0'),
          status: data.status,
          product_image: data.product_image,
          guidelines: data.guidelines || [],
          deliverables: data.deliverables || [],
          timeline: data.timeline || {},
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
        });

        return data;
      },
      update: (id: string, updates: Partial<DbCampaign>): DbCampaign | null => {
        const idx = this.schema.campaigns.findIndex(c => c.id === id);
        if (idx === -1) return null;

        this.schema.campaigns[idx] = {
          ...this.schema.campaigns[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.campaigns[idx];
        this.schedulePersist();

        syncRecordToSupabase('campaigns', {
          id: updated.id,
          brand_id: updated.brand_id,
          brand_name: updated.brand_name,
          campaign_name: updated.name,
          category: updated.category,
          description: updated.description,
          budget: updated.budget,
          budget_display: updated.reward_display || (updated.budget ? `₹${updated.budget.toLocaleString()}` : '₹0'),
          status: updated.status,
          product_image: updated.product_image,
          guidelines: updated.guidelines || [],
          deliverables: updated.deliverables || [],
          invited_creator_ids: updated.invited_creator_ids || [],
          applied_creator_ids: updated.applied_creator_ids || [],
          accepted_creator_ids: updated.accepted_creator_ids || [],
          timeline: updated.timeline || {},
          updated_at: updated.updated_at,
        });

        return updated;
      },
      updateAsync: async (id: string, updates: Partial<DbCampaign>): Promise<DbCampaign | null> => {
        const idx = this.schema.campaigns.findIndex(c => c.id === id);
        if (idx === -1) return null;

        this.schema.campaigns[idx] = {
          ...this.schema.campaigns[idx],
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const updated = this.schema.campaigns[idx];
        this.schedulePersist();

        await syncRecordToSupabase('campaigns', {
          id: updated.id,
          brand_id: updated.brand_id,
          brand_name: updated.brand_name,
          campaign_name: updated.name,
          category: updated.category,
          description: updated.description,
          budget: updated.budget,
          budget_display: updated.reward_display || (updated.budget ? `₹${updated.budget.toLocaleString()}` : '₹0'),
          status: updated.status,
          product_image: updated.product_image,
          guidelines: updated.guidelines || [],
          deliverables: updated.deliverables || [],
          invited_creator_ids: updated.invited_creator_ids || [],
          applied_creator_ids: updated.applied_creator_ids || [],
          accepted_creator_ids: updated.accepted_creator_ids || [],
          timeline: updated.timeline || {},
          updated_at: updated.updated_at,
        });

        return updated;
      },
    };
  }

  public get collaborationRequests() {
    return {
      all: () => [...this.schema.collaboration_requests],
      findById: (id: string) => this.schema.collaboration_requests.find(r => r.id === id) || null,
      findByBrandId: (brandId: string) => this.schema.collaboration_requests.filter(r => r.brand_id === brandId),
      findByCreatorId: (creatorId: string) => this.schema.collaboration_requests.filter(r => r.creator_id === creatorId),
      findByCampaignId: (campaignId: string) => this.schema.collaboration_requests.filter(r => r.campaign_id === campaignId),
      create: (data: DbCollaborationRequest): DbCollaborationRequest => {
        this.schema.collaboration_requests.unshift(data);
        this.schedulePersist();
        syncRecordToSupabase('collaboration_requests', data);
        return data;
      },
      updateStatus: (id: string, status: DbCollaborationRequest['status']): DbCollaborationRequest | null => {
        const idx = this.schema.collaboration_requests.findIndex(r => r.id === id);
        if (idx === -1) return null;

        this.schema.collaboration_requests[idx].status = status;
        this.schema.collaboration_requests[idx].updated_at = new Date().toISOString();
        this.schedulePersist();
        syncRecordToSupabase('collaboration_requests', this.schema.collaboration_requests[idx]);
        return this.schema.collaboration_requests[idx];
      },
    };
  }

  public get savedItems() {
    return {
      getSavedCreators: (brandId: string) => this.schema.saved_creators.filter(s => s.owner_id === brandId).map(s => s.target_id),
      saveCreator: (brandId: string, creatorId: string) => {
        const exists = this.schema.saved_creators.some(s => s.owner_id === brandId && s.target_id === creatorId);
        if (exists) return false;
        this.schema.saved_creators.push({
          id: `sc-${Date.now()}`,
          entity_type: 'creator',
          owner_id: brandId,
          target_id: creatorId,
          created_at: new Date().toISOString(),
        });
        this.schedulePersist();
        return true;
      },
      unsaveCreator: (brandId: string, creatorId: string) => {
        const initialLen = this.schema.saved_creators.length;
        this.schema.saved_creators = this.schema.saved_creators.filter(s => !(s.owner_id === brandId && s.target_id === creatorId));
        this.schedulePersist();
        return this.schema.saved_creators.length < initialLen;
      },
      getSavedBrands: (creatorId: string) => this.schema.saved_brands.filter(s => s.owner_id === creatorId).map(s => s.target_id),
      saveBrand: (creatorId: string, brandId: string) => {
        const exists = this.schema.saved_brands.some(s => s.owner_id === creatorId && s.target_id === brandId);
        if (exists) return false;
        this.schema.saved_brands.push({
          id: `sb-${Date.now()}`,
          entity_type: 'brand',
          owner_id: creatorId,
          target_id: brandId,
          created_at: new Date().toISOString(),
        });
        this.schedulePersist();
        return true;
      },
      unsaveBrand: (creatorId: string, brandId: string) => {
        const initialLen = this.schema.saved_brands.length;
        this.schema.saved_brands = this.schema.saved_brands.filter(s => !(s.owner_id === creatorId && s.target_id === brandId));
        this.schedulePersist();
        return this.schema.saved_brands.length < initialLen;
      },
    };
  }

  public get notifications() {
    return {
      all: () => [...this.schema.notifications],
      findByUser: (userId: string, role?: 'brand' | 'creator') => {
        return this.schema.notifications
          .filter(n => n.user_id === userId || (role && n.role === role))
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      },
      create: (data: Omit<DbNotification, 'id' | 'created_at'>): DbNotification => {
        const notif: DbNotification = {
          ...data,
          id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          created_at: new Date().toISOString(),
        };
        this.schema.notifications.unshift(notif);
        this.schedulePersist();
        syncRecordToSupabase('notifications', notif);
        return notif;
      },
      markRead: (id: string) => {
        const notif = this.schema.notifications.find(n => n.id === id);
        if (notif) {
          notif.read = true;
          this.schedulePersist();
        }
      },
      markAllRead: (userId: string) => {
        this.schema.notifications.forEach(n => {
          if (n.user_id === userId) n.read = true;
        });
        this.schedulePersist();
      },
    };
  }

  public get conversations() {
    return {
      all: () => [...this.schema.conversations],
      findByParticipant: (participantId: string) => {
        return this.schema.conversations.filter(
          c => c.brand_id === participantId || c.creator_id === participantId || c.participant_id === participantId
        );
      },
      findById: (id: string) => this.schema.conversations.find(c => c.id === id) || null,
      create: (data: DbConversation) => {
        this.schema.conversations.unshift(data);
        this.schedulePersist();
        return data;
      },
    };
  }

  public get messages() {
    return {
      findByConversation: (convId: string) => this.schema.messages.filter(m => m.conversation_id === convId),
      create: (data: Omit<DbMessage, 'id' | 'created_at'>) => {
        const msg: DbMessage = {
          ...data,
          id: `msg-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        this.schema.messages.push(msg);
        const conv = this.schema.conversations.find(c => c.id === data.conversation_id);
        if (conv) {
          conv.last_message = data.text;
          conv.last_message_time = data.timestamp;
          conv.updated_at = new Date().toISOString();
        }
        this.schedulePersist();
        return msg;
      },
    };
  }
}

// Global Singleton to ensure single in-memory instance across Next.js API routes
declare global {
  // eslint-disable-next-line no-var
  var __dbEngineInstance: RelationalDatabaseEngine | undefined;
}

export const dbEngine = global.__dbEngineInstance || new RelationalDatabaseEngine();
if (process.env.NODE_ENV !== 'production') {
  global.__dbEngineInstance = dbEngine;
}
