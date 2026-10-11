/**
 * CreatorMatch AI - Frontend API Client
 * Centralized, typed API consumer connecting frontend UI to backend REST endpoints.
 */

export interface ApiRecommendedCreator {
  creator: any;
  match: {
    creatorId: string;
    brandId: string;
    campaignId: string | null;
    overallScore: number;
    recommendationVerdict: string;
    positiveFactors: string[];
    negativeFactors: string[];
    breakdown: any;
    aiReasoning: string;
    explanation: string;
  };
}

export interface ApiRecommendedBrand {
  brand: any;
  activeCampaign: any;
  match: {
    creatorId: string;
    brandId: string;
    campaignId: string | null;
    overallScore: number;
    recommendationVerdict: string;
    positiveFactors: string[];
    negativeFactors: string[];
    breakdown: any;
    aiReasoning: string;
    explanation: string;
  };
}

class ApiClient {
  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `HTTP ${res.status}: ${res.statusText}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      console.warn(`[ApiClient] Request failed for ${url}:`, err);
      throw err;
    }
  }

  // Auth
  async login(email: string, role?: string) {
    return this.fetchJson<{ success: boolean; user: any; profile: any; role: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async register(data: { email: string; name: string; role: string; profileData?: any }) {
    return this.fetchJson<{ success: boolean; user: any; profile: any }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe(userId?: string, role?: string) {
    const q = new URLSearchParams();
    if (userId) q.set('userId', userId);
    if (role) q.set('role', role);
    return this.fetchJson<{ success: boolean; user: any; profile: any; role: string }>(`/api/auth/me?${q.toString()}`);
  }

  // Brands & Recommendations
  async getBrands(params?: { industry?: string; search?: string }) {
    const q = new URLSearchParams();
    if (params?.industry) q.set('industry', params.industry);
    if (params?.search) q.set('search', params.search);
    return this.fetchJson<{ success: boolean; brands: any[] }>(`/api/brands?${q.toString()}`);
  }

  async getBrandById(id: string) {
    return this.fetchJson<{ success: boolean; brand: any; campaigns: any[] }>(`/api/brands/${id}`);
  }

  async getRecommendedCreators(
    brandId: string,
    params?: {
      campaignId?: string;
      category?: string;
      platform?: string;
      minFollowers?: number;
      minEngagement?: number;
      sortBy?: string;
      search?: string;
    }
  ) {
    const q = new URLSearchParams();
    if (params?.campaignId) q.set('campaignId', params.campaignId);
    if (params?.category) q.set('category', params.category);
    if (params?.platform) q.set('platform', params.platform);
    if (params?.minFollowers) q.set('minFollowers', params.minFollowers.toString());
    if (params?.minEngagement) q.set('minEngagement', params.minEngagement.toString());
    if (params?.sortBy) q.set('sortBy', params.sortBy);
    if (params?.search) q.set('search', params.search);

    return this.fetchJson<{
      success: boolean;
      brand: any;
      campaignContext: any;
      totalCount: number;
      recommendations: ApiRecommendedCreator[];
    }>(`/api/brands/${brandId}/recommended-creators?${q.toString()}`);
  }

  // Creators & Reverse Recommendations ("Find Brands For You")
  async getCreators(params?: { category?: string; search?: string; minEngagement?: number }) {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.minEngagement) q.set('minEngagement', params.minEngagement.toString());
    return this.fetchJson<{ success: boolean; creators: any[] }>(`/api/creators?${q.toString()}`);
  }

  async getCreatorById(id: string) {
    return this.fetchJson<{ success: boolean; creator: any }>(`/api/creators/${id}`);
  }

  async getRecommendedBrands(
    creatorId: string,
    params?: {
      industry?: string;
      sortBy?: string;
      search?: string;
    }
  ) {
    const q = new URLSearchParams();
    if (params?.industry) q.set('industry', params.industry);
    if (params?.sortBy) q.set('sortBy', params.sortBy);
    if (params?.search) q.set('search', params.search);

    return this.fetchJson<{
      success: boolean;
      creator: any;
      totalCount: number;
      recommendations: ApiRecommendedBrand[];
    }>(`/api/creators/${creatorId}/recommended-brands?${q.toString()}`);
  }

  // Campaigns
  async getCampaigns(params?: { brandId?: string; category?: string; status?: string }) {
    const q = new URLSearchParams();
    if (params?.brandId) q.set('brandId', params.brandId);
    if (params?.category) q.set('category', params.category);
    if (params?.status) q.set('status', params.status);
    return this.fetchJson<{ success: boolean; campaigns: any[] }>(`/api/campaigns?${q.toString()}`);
  }

  async getCampaignById(id: string) {
    return this.fetchJson<{ success: boolean; campaign: any; applications: any[] }>(`/api/campaigns/${id}`);
  }

  async createCampaign(data: any) {
    return this.fetchJson<{ success: boolean; campaign: any }>('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Collaborations
  async getCollaborations(params?: { brandId?: string; creatorId?: string; campaignId?: string; status?: string }) {
    const q = new URLSearchParams();
    if (params?.brandId) q.set('brandId', params.brandId);
    if (params?.creatorId) q.set('creatorId', params.creatorId);
    if (params?.campaignId) q.set('campaignId', params.campaignId);
    if (params?.status) q.set('status', params.status);
    return this.fetchJson<{ success: boolean; requests: any[] }>(`/api/collaborations?${q.toString()}`);
  }

  async createCollaboration(data: any) {
    return this.fetchJson<{ success: boolean; collaboration: any; match: any }>('/api/collaborations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCollaboration(id: string, status: 'accepted' | 'declined') {
    return this.fetchJson<{ success: boolean; collaboration: any }>('/api/collaborations', {
      method: 'PATCH',
      body: JSON.stringify({ id, status }),
    });
  }

  // Saved Creators & Brands
  async getSavedCreators(brandId: string) {
    return this.fetchJson<{ success: boolean; savedCreatorIds: string[]; creators: any[] }>(`/api/saved/creators?brandId=${brandId}`);
  }

  async saveCreator(brandId: string, creatorId: string) {
    return this.fetchJson<{ success: boolean; saved: boolean }>('/api/saved/creators', {
      method: 'POST',
      body: JSON.stringify({ brandId, creatorId }),
    });
  }

  async unsaveCreator(brandId: string, creatorId: string) {
    return this.fetchJson<{ success: boolean; unsaved: boolean }>(`/api/saved/creators?brandId=${brandId}&creatorId=${creatorId}`, {
      method: 'DELETE',
    });
  }

  async getSavedBrands(creatorId: string) {
    return this.fetchJson<{ success: boolean; savedBrandIds: string[]; brands: any[] }>(`/api/saved/brands?creatorId=${creatorId}`);
  }

  async saveBrand(creatorId: string, brandId: string) {
    return this.fetchJson<{ success: boolean; saved: boolean }>('/api/saved/brands', {
      method: 'POST',
      body: JSON.stringify({ creatorId, brandId }),
    });
  }

  async unsaveBrand(creatorId: string, brandId: string) {
    return this.fetchJson<{ success: boolean; unsaved: boolean }>(`/api/saved/brands?creatorId=${creatorId}&brandId=${brandId}`, {
      method: 'DELETE',
    });
  }

  // Notifications
  async getNotifications(userId?: string, role?: string) {
    const q = new URLSearchParams();
    if (userId) q.set('userId', userId);
    if (role) q.set('role', role);
    return this.fetchJson<{ success: boolean; notifications: any[] }>(`/api/notifications?${q.toString()}`);
  }

  async markNotificationRead(id: string) {
    return this.fetchJson<{ success: boolean }>('/api/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ id }),
    });
  }

  // Dashboard Statistics
  async getDashboardStats(role: 'brand' | 'creator', id?: string) {
    const q = new URLSearchParams({ role });
    if (id) q.set('id', id);
    return this.fetchJson<any>(`/api/stats/dashboard?${q.toString()}`);
  }

  // AI Assistant Bot
  async askAiAssistant(prompt: string, role: 'brand' | 'creator', currentId?: string) {
    return this.fetchJson<{ success: boolean; reply: string; recommendations?: any[] }>('/api/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ prompt, role, currentId }),
    });
  }
}

export const apiClient = new ApiClient();
