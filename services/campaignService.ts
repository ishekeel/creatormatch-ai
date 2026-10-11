import { Campaign } from '@/types';
import { db } from './db';

/**
 * Service layer for Campaign operations.
 * Handles campaign lifecycle: drafts, published, submissions, invite, applications.
 */
export const campaignService = {
  /**
   * Fetch all campaigns or filter by brand
   */
  async getAllCampaigns(brandId?: string): Promise<Campaign[]> {
    const list = db.getCampaigns();
    if (brandId) {
      return list.filter((c) => c.brandId === brandId);
    }
    return list;
  },

  /**
   * Fetch single campaign by ID
   */
  async getCampaignById(id: string): Promise<Campaign | undefined> {
    const list = db.getCampaigns();
    return list.find((c) => c.id === id);
  },

  /**
   * Create or update campaign
   */
  async saveCampaign(campaign: Campaign): Promise<Campaign> {
    db.saveCampaign(campaign);
    return campaign;
  },

  /**
   * Update campaign status
   */
  async updateStatus(
    campaignId: string,
    status: Campaign['status']
  ): Promise<Campaign | undefined> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return undefined;
    const updated = { ...campaign, status };
    db.saveCampaign(updated);
    return updated;
  },

  /**
   * Invite creator to campaign
   */
  async inviteCreator(campaignId: string, creatorId: string): Promise<boolean> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return false;
    if (!campaign.invitedCreatorIds.includes(creatorId)) {
      campaign.invitedCreatorIds.push(creatorId);
      db.saveCampaign(campaign);
    }
    return true;
  },
};
