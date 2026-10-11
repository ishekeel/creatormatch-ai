import { Creator, CreatorSustainability } from '@/types';
import { db } from './db';

/**
 * Service layer for Creator domain operations.
 * Wraps persistent storage / Supabase client queries.
 */
export const creatorService = {
  /**
   * Get all creators in the platform database
   */
  async getAllCreators(): Promise<Creator[]> {
    return db.getCreators();
  },

  /**
   * Get single creator by ID
   */
  async getCreatorById(id: string): Promise<Creator | undefined> {
    const creators = db.getCreators();
    return creators.find((c) => c.id === id);
  },

  /**
   * Update creator profile data
   */
  async updateCreator(updated: Creator): Promise<Creator> {
    db.saveCreator(updated);
    return updated;
  },

  /**
   * Update creator sustainability metrics (Water Offset L & Eco badge)
   */
  async updateSustainability(
    creatorId: string,
    sustainability: CreatorSustainability
  ): Promise<Creator | undefined> {
    return db.updateCreatorSustainability(creatorId, sustainability);
  },

  /**
   * Get creator credit balance & ledger items
   */
  async getCreatorCredits(creatorId: string) {
    const allCredits = db.getCredits();
    return allCredits.filter((c) => c.creatorId === creatorId);
  },

  /**
   * Get achievements for a creator
   */
  async getCreatorAchievements(_creatorId?: string) {
    return db.getAchievements();
  },
};
