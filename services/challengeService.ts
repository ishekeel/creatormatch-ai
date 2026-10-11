import { Challenge, ChallengeEntry } from '@/types';
import { db } from './db';

/**
 * Service layer for Meme & Creative Challenges.
 * Handles viral challenges, community submissions, upvotes, and leaderboard awards.
 */
export const challengeService = {
  /**
   * Fetch all creative/meme challenges
   */
  async getAllChallenges(): Promise<Challenge[]> {
    return db.getChallenges();
  },

  /**
   * Fetch challenge by ID
   */
  async getChallengeById(id: string): Promise<Challenge | undefined> {
    const list = db.getChallenges();
    return list.find((c) => c.id === id);
  },

  /**
   * Create new challenge
   */
  async saveChallenge(challenge: Challenge): Promise<Challenge> {
    db.saveChallenge(challenge);
    return challenge;
  },

  /**
   * Get all entries for a specific challenge, sorted by upvotes
   */
  async getEntries(challengeId: string): Promise<ChallengeEntry[]> {
    return db.getEntriesForChallenge(challengeId);
  },

  /**
   * Submit an entry to a challenge
   */
  async submitEntry(entry: ChallengeEntry): Promise<ChallengeEntry> {
    db.saveChallengeEntry(entry.challengeId, entry);
    return entry;
  },

  /**
   * Upvote a challenge entry
   */
  async upvoteEntry(entryId: string): Promise<boolean> {
    return db.upvoteChallengeEntry(entryId);
  },

  /**
   * Award challenge winner (+500 Creator Credits & update winner state)
   */
  async awardWinner(
    challengeId: string,
    winnerCreatorId: string
  ): Promise<boolean> {
    return db.awardChallengeWinner(challengeId, winnerCreatorId);
  },
};
