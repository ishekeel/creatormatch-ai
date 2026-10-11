'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  User,
  Brand,
  Creator,
  Campaign,
  Submission,
  Challenge,
  ChallengeEntry,
  Achievement,
  CreatorCreditItem,
  Conversation,
  Message,
  NotificationItem,
  PortfolioItem,
  SustainabilityRecord,
  ConnectionRequest,
  ConnectionStatus,
  CampaignApplication,
} from '@/types';
import { mockBrands } from '@/data/brands';
import { mockCreators } from '@/data/creators';
import { mockCampaigns } from '@/data/campaigns';
import { mockChallenges, mockChallengeEntries } from '@/data/challenges';
import { mockAchievements, mockInitialCredits } from '@/data/achievements';
import { AuthService } from '@/services/authService';
import { evaluateContent } from '@/services/submissionService';
import { calculateMatchScore } from '@/services/matchingService';
import { db } from '@/services/db';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  // Current user & role
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  activeBrand: Brand;
  activeCreator: Creator;

  // Brands Directory & Registration
  brands: Brand[];
  registerNewBrand: (brandData: {
    name: string;
    industry: string;
    operatingDuration: string;
    location: string;
    website?: string;
    description: string;
    targetAudience: string;
    products: { name: string; category: string; description: string; image: string }[];
    email?: string;
    password?: string;
  }) => Promise<Brand>;

  // Creators Directory, Registration & Portfolio Builder
  creators: Creator[];
  getCreatorById: (id: string) => Creator | undefined;
  registerNewCreator: (creatorData: {
    name: string;
    email?: string;
    avatar?: string;
    handle: string;
    bio: string;
    location: string;
    languages: string[];
    niche: string[];
    categories: string[];
    socialUrls: { instagram?: string; youtube?: string; tiktok?: string };
    highestFollowers: number;
    highestFollowersDisplay: string;
    engagementRate: number;
    portfolio: PortfolioItem[];
    pastBrandsWorkedWith?: string[];
    password?: string;
  }) => Promise<Creator>;
  updateCreatorProfile: (data: Partial<Creator>) => void;
  addCreatorPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  switchAccount: (targetRole: Role, id: string) => void;

  // Campaigns & Applications
  campaigns: Campaign[];
  campaignApplications: CampaignApplication[];
  addCampaign: (campaign: Campaign) => void;
  inviteCreatorToCampaign: (campaignId: string, creatorId: string) => void;
  acceptCampaignInvitation: (campaignId: string, creatorId: string) => void;
  applyToCampaign: (
    campaignId: string,
    creatorId: string,
    details?: {
      deliverableType?: string;
      pitchVideoUrl?: string;
      pitchVideoTitle?: string;
      conceptPitch?: string;
      samplePostUrl?: string;
    }
  ) => void;
  acceptCampaignApplication: (applicationId: string) => void;
  declineCampaignApplication: (applicationId: string) => void;

  // Content Submissions
  submissions: Submission[];
  submitContent: (submission: Omit<Submission, 'id' | 'submissionDate' | 'status' | 'aiQualityScore' | 'aiBreakdown' | 'aiFeedback'>) => Submission;
  approveSubmission: (submissionId: string) => void;
  requestChangesSubmission: (submissionId: string, note?: string) => void;

  // Meme & Creative Challenges
  challenges: Challenge[];
  challengeEntries: Record<string, ChallengeEntry[]>;
  createChallenge: (challenge: Challenge) => void;
  submitChallengeEntry: (entry: Omit<ChallengeEntry, 'id' | 'submittedAt' | 'rank' | 'votes' | 'engagement' | 'aiScore'>) => void;
  awardChallengeWinner: (challengeId: string, winnerEntryId: string) => void;

  // Gamification & Reputation
  creatorCredits: number;
  creditsHistory: CreatorCreditItem[];
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;

  // Messaging
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, text: string) => void;
  startOrGetConversation: (brandId: string, creatorId: string, campaignContext?: { id: string; name: string }) => string;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Toast UI
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Sustainability & Database Persistence
  updateBrandSustainability: (data: {
    waterEmissionLiters?: number;
    waterEmissionSavedLiters?: number;
    diapersCount?: number;
    diapersDistributed?: number;
    diaperType?: string;
    ecoScore?: number;
    notes?: string;
  }) => void;
  updateCreatorSustainability: (data: {
    waterEmissionSavedLiters: number;
    ecoScore?: number;
    notes?: string;
  }) => void;
  setActiveBrandById: (id: string) => void;
  setActiveCreatorById: (id: string) => void;
  sustainabilityRecords: any[];

  // Connection Networking (LinkedIn-Style Verification Before Messaging)
  connections: ConnectionRequest[];
  sendConnectionRequest: (targetId: string, note?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  declineConnectionRequest: (requestId: string) => void;
  getConnectionStatus: (targetId: string) => ConnectionStatus;
  isUserConnected: (targetId: string) => boolean;

  // Authentication & Session
  isAuthenticated: boolean;
  isAuthReady: boolean;
  loginUser: (targetRole: Role, entityId: string, email?: string) => void;
  validateAndLogin: (email: string, password: string, role?: Role) => Promise<{ success: boolean; role?: Role; message?: string }>;
  logoutUser: () => void;

  // Data Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>('brand');
  const [currentUser, setCurrentUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    role: 'brand',
    avatar: '',
  });
  const [brands, setBrands] = useState<Brand[]>([]);
  const [activeBrand, setActiveBrand] = useState<Brand>({
    id: '',
    name: 'Brand Sponsor',
    logo: '',
    description: '',
    website: '',
    industry: 'General',
    location: '',
    targetAudience: '',
    products: [],
    stats: {
      activeCampaigns: 0,
      creatorsCollaborating: 0,
      totalReach: '0',
      avgEngagement: '0%',
      conversions: 0,
      roi: '0x',
    },
  });
  const [creators, setCreators] = useState<Creator[]>([]);
  const [activeCreator, setActiveCreator] = useState<Creator>({
    id: '',
    name: 'Content Creator',
    handle: '@creator',
    avatar: '',
    bio: '',
    niche: [],
    categories: [],
    location: '',
    languages: [],
    socialPlatforms: [],
    followers: 0,
    followersDisplay: '0',
    avgViews: '0',
    engagementRate: 0,
    engagementDisplay: '0%',
    creatorScore: 80,
    creatorCredits: 0,
    campaignWins: 0,
    completedCampaigns: 0,
    totalReach: '0',
    verified: false,
    audience: {
      ageBreakdown: {},
      topLocations: [],
      genderSplit: { female: 50, male: 50, other: 0 },
      topInterests: [],
    },
    portfolio: [],
    verifiedCampaigns: [],
  });

  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [challengeEntries, setChallengeEntries] = useState<Record<string, ChallengeEntry[]>>({});
  const [creatorCredits, setCreatorCredits] = useState<number>(0);
  const [creditsHistory, setCreditsHistory] = useState<CreatorCreditItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [sustainabilityRecords, setSustainabilityRecords] = useState<any[]>([]);
  const [connections, setConnections] = useState<ConnectionRequest[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);

  // Initial Content Submissions
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Campaign Applications & Pitch Videos
  const [campaignApplications, setCampaignApplications] = useState<CampaignApplication[]>([]);

  // Conversations & Messages
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    db.initDatabase();
    const initConnections = db.getConnections();
    setConnections(initConnections);
    setSustainabilityRecords(db.getSustainabilityRecords());

    // Load initial persistent conversations and messages
    const storedConvs = db.getConversations();
    const storedMsgs = db.getMessages();

    // Ensure every accepted connection has an active conversation session
    const activeConns = initConnections.filter(c => c.status === 'accepted');
    activeConns.forEach(conn => {
      const bId = conn.senderRole === 'brand' ? conn.senderId : conn.receiverId;
      const bName = conn.senderRole === 'brand' ? conn.senderName : conn.receiverName;
      const bLogo = conn.senderRole === 'brand' ? conn.senderAvatar : conn.receiverAvatar;
      const cId = conn.senderRole === 'creator' ? conn.senderId : conn.receiverId;
      const cName = conn.senderRole === 'creator' ? conn.senderName : conn.receiverName;
      const cAvatar = conn.senderRole === 'creator' ? conn.senderAvatar : conn.receiverAvatar;
      const convId = `conv-${bId}-${cId}`;

      const exists = storedConvs.find(c => c.id === convId || (c.brandId === bId && c.creatorId === cId));
      if (!exists) {
        const newConv: Conversation = {
          id: convId,
          brandId: bId,
          brandName: bName,
          brandLogo: bLogo,
          creatorId: cId,
          creatorName: cName,
          creatorAvatar: cAvatar,
          participantId: cId,
          participantName: cName,
          participantAvatar: cAvatar,
          participantRole: 'creator',
          lastMessage: 'Connection established. Direct messaging is now unlocked!',
          lastMessageTime: conn.createdAt || 'Just now',
          unreadCount: 0,
        };
        db.saveConversation(newConv);
        storedConvs.push(newConv);
      }
    });

    setConversations(storedConvs);
    setMessages(storedMsgs);
    if (storedConvs.length > 0) {
      setActiveConversationId(storedConvs[0].id);
    }

    // Fetch live database records from backend APIs
    const fetchLiveDatabase = async () => {
      try {
        const [bRes, cRes, campRes, colRes, msgRes] = await Promise.all([
          fetch('/api/brands').then(r => r.json()).catch(() => ({ brands: [] })),
          fetch('/api/creators').then(r => r.json()).catch(() => ({ creators: [] })),
          fetch('/api/campaigns').then(r => r.json()).catch(() => ({ campaigns: [] })),
          fetch('/api/collaborations').then(r => r.json()).catch(() => ({ requests: [] })),
          fetch('/api/messages').then(r => r.json()).catch(() => ({ conversations: [] })),
        ]);

        if (bRes.brands && Array.isArray(bRes.brands)) {
          const mappedBrands: Brand[] = bRes.brands.map((b: any) => ({
            id: b.id,
            name: b.brand_name || b.name,
            logo: b.logo,
            description: b.description || '',
            website: b.website || '',
            industry: b.industry || 'General',
            location: b.location || '',
            targetAudience: typeof b.target_audience === 'object' ? b.target_audience?.description || '' : b.target_audience || '',
            products: b.products || [],
            stats: b.stats || {
              activeCampaigns: 0,
              creatorsCollaborating: 0,
              totalReach: '0',
              avgEngagement: '0%',
              conversions: 0,
              roi: '0x',
            },
          }));
          setBrands(mappedBrands);
        }

        if (cRes.creators && Array.isArray(cRes.creators)) {
          const mappedCreators: Creator[] = cRes.creators.map((c: any) => ({
            id: c.id,
            name: c.creator_name || c.name,
            handle: c.handle ? (c.handle.startsWith('@') ? c.handle : `@${c.handle}`) : `@${(c.name || 'creator').toLowerCase().replace(/\s+/g, '_')}`,
            avatar: c.avatar,
            bio: c.bio || '',
            niche: c.niche || [],
            categories: c.categories || [],
            location: c.location || '',
            languages: c.languages || ['English'],
            socialPlatforms: c.social_platforms || [],
            followers: c.followers || 0,
            followersDisplay: c.followers_display || '0',
            avgViews: c.avg_views || '0',
            engagementRate: c.engagement_rate || 0,
            engagementDisplay: c.engagement_display || '0%',
            creatorScore: c.creator_score || 80,
            creatorCredits: c.creator_credits || 0,
            campaignWins: c.campaign_wins || 0,
            completedCampaigns: c.completed_campaigns || 0,
            totalReach: c.total_reach || '0',
            verified: c.verified !== undefined ? c.verified : true,
            audience: {
              ageBreakdown: c.audience_demographics?.age_breakdown || {},
              topLocations: c.audience_demographics?.top_locations || [],
              genderSplit: c.audience_demographics?.gender_split || { female: 50, male: 50, other: 0 },
              topInterests: c.audience_demographics?.top_interests || [],
            },
            portfolio: c.portfolio || [],
            verifiedCampaigns: [],
          }));
          setCreators(mappedCreators);
        }

        if (campRes.campaigns && Array.isArray(campRes.campaigns)) {
          const mappedCampaigns: Campaign[] = campRes.campaigns.map((camp: any) => ({
            id: camp.id,
            brandId: camp.brand_id,
            brandName: camp.brand_name,
            brandLogo: camp.brand_logo || '',
            name: camp.name,
            product: camp.product,
            category: camp.category || 'General',
            description: camp.description || '',
            productImage: camp.product_image || '',
            objective: camp.objective || 'Brand Awareness',
            targetAudience: typeof camp.target_audience === 'object' ? camp.target_audience?.description || '' : camp.target_audience || '',
            requiredPlatforms: camp.required_platforms || ['Instagram'],
            deliverables: camp.deliverables || [],
            guidelines: camp.guidelines,
            timeline: camp.timeline || { startDate: '', endDate: '', submissionDeadline: '' },
            budget: camp.budget || 0,
            rewardDisplay: camp.reward_display || `₹${(camp.budget || 0).toLocaleString()}`,
            deadlineDisplay: camp.deadline_display || '',
            invitedCreatorIds: camp.invited_creator_ids || [],
            acceptedCreatorIds: camp.accepted_creator_ids || [],
            appliedCreatorIds: camp.applied_creator_ids || [],
            status: camp.status || 'active',
            reach: camp.reach || '0',
            engagement: camp.engagement || '0%',
            conversions: camp.conversions || 0,
          }));
          setCampaigns(mappedCampaigns);
        }

        if (colRes.requests && Array.isArray(colRes.requests)) {
          setCampaignApplications(colRes.requests);
        }

        if (msgRes.conversations && Array.isArray(msgRes.conversations) && msgRes.conversations.length > 0) {
          setConversations(prev => {
            const list = [...prev];
            msgRes.conversations.forEach((sc: any) => {
              if (!list.some(c => c.id === sc.id)) {
                list.push({
                  id: sc.id,
                  brandId: sc.brand_id,
                  brandName: sc.brand_name || 'Brand Sponsor',
                  creatorId: sc.creator_id,
                  creatorName: sc.creator_name || 'Content Creator',
                  participantId: sc.participant_id,
                  participantName: sc.participant_name,
                  participantAvatar: sc.participant_avatar || '',
                  participantRole: sc.participant_role || 'creator',
                  lastMessage: sc.last_message || '',
                  lastMessageTime: sc.last_message_time || 'Just now',
                  unreadCount: sc.unread_count || 0,
                });
              }
            });
            return list;
          });
        }
      } catch (err) {
        console.warn('API hydration warning:', err);
      }

      // Check persistent session from database
      const session = db.getSession();
      if (session && session.isAuthenticated && session.userId) {
        setIsAuthenticated(true);
        setRoleState(session.role);
        setCurrentUser({
          id: session.userId,
          name: session.name,
          email: session.email,
          role: session.role,
          avatar: session.avatar,
        });

        const storedB = db.getBrands();
        const storedC = db.getCreators();
        if (session.role === 'brand') {
          const foundB = storedB.find(item => item.id === session.entityId);
          if (foundB) setActiveBrand(foundB);
        } else {
          const foundC = storedC.find(item => item.id === session.entityId);
          if (foundC) setActiveCreator(foundC);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthReady(true);
    };

    fetchLiveDatabase();
  }, []);

  // Sync role changes
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const loginUser = (targetRole: Role, entityId: string, email?: string) => {
    setRoleState(targetRole);
    setIsAuthenticated(true);
    if (targetRole === 'brand') {
      const b = brands.find(item => item.id === entityId);
      if (b) {
        setActiveBrand(b);
        const userObj: User = {
          id: `user-${b.id}`,
          name: b.name,
          email: email || `${b.name.toLowerCase().replace(/\s+/g, '')}@brand.com`,
          role: 'brand',
          avatar: b.logo,
        };
        setCurrentUser(userObj);
        db.saveSession({
          isAuthenticated: true,
          role: 'brand',
          entityId: b.id,
          userId: userObj.id,
          name: userObj.name,
          email: userObj.email,
          avatar: userObj.avatar,
        });
      }
    } else {
      const c = creators.find(item => item.id === entityId);
      if (c) {
        setActiveCreator(c);
        const userObj: User = {
          id: `user-${c.id}`,
          name: c.name,
          email: email || `${c.handle.replace('@', '')}@creator.com`,
          role: 'creator',
          avatar: c.avatar,
        };
        setCurrentUser(userObj);
        db.saveSession({
          isAuthenticated: true,
          role: 'creator',
          entityId: c.id,
          userId: userObj.id,
          name: userObj.name,
          email: userObj.email,
          avatar: userObj.avatar,
        });
      }
    }
  };

  const validateAndLogin = async (
    emailInput: string,
    passwordInput: string,
    targetRole?: Role
  ): Promise<{ success: boolean; role?: Role; message?: string }> => {
    const cleanEmail = emailInput.trim().toLowerCase();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: passwordInput, role: targetRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          message: data.error || 'Authentication failed. Please verify your credentials.',
        };
      }

      const user = data.user;
      const profile = data.profile;
      const resolvedRole = data.role as Role;

      setRoleState(resolvedRole);
      setIsAuthenticated(true);
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });

      if (resolvedRole === 'brand' && profile) {
        const brandObj: Brand = {
          id: profile.id,
          name: profile.brand_name || user.name,
          logo: profile.logo || user.avatar,
          description: profile.description || '',
          website: profile.website || '',
          industry: profile.industry || 'General',
          location: profile.location || '',
          targetAudience: typeof profile.target_audience === 'object' ? profile.target_audience?.description || '' : profile.target_audience || '',
          products: profile.products || [],
          stats: profile.stats || {
            activeCampaigns: 0,
            creatorsCollaborating: 0,
            totalReach: '0',
            avgEngagement: '0%',
            conversions: 0,
            roi: '0x',
          },
        };
        setActiveBrand(brandObj);
        db.saveBrand(brandObj);
        setBrands(prev => {
          const exists = prev.some(b => b.id === brandObj.id);
          return exists ? prev.map(b => b.id === brandObj.id ? brandObj : b) : [brandObj, ...prev];
        });
        db.saveSession({
          isAuthenticated: true,
          role: 'brand',
          entityId: brandObj.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        });
      } else if (resolvedRole === 'creator' && profile) {
        const creatorObj: Creator = {
          id: profile.id,
          name: profile.creator_name || user.name,
          handle: profile.handle ? (profile.handle.startsWith('@') ? profile.handle : `@${profile.handle}`) : `@${(user.name || 'creator').toLowerCase().replace(/\s+/g, '_')}`,
          avatar: profile.avatar || user.avatar,
          bio: profile.bio || '',
          niche: profile.niche || [],
          categories: profile.categories || [],
          location: profile.location || '',
          languages: profile.languages || ['English'],
          socialPlatforms: profile.social_platforms || [],
          followers: profile.followers || 0,
          followersDisplay: profile.followers_display || '0',
          avgViews: profile.avg_views || '0',
          engagementRate: profile.engagement_rate || 0,
          engagementDisplay: profile.engagement_display || '0%',
          creatorScore: profile.creator_score || 80,
          creatorCredits: profile.creator_credits || 0,
          campaignWins: profile.campaign_wins || 0,
          completedCampaigns: profile.completed_campaigns || 0,
          totalReach: profile.total_reach || '0',
          verified: profile.verified !== undefined ? profile.verified : true,
          audience: {
            ageBreakdown: profile.audience_demographics?.age_breakdown || {},
            topLocations: profile.audience_demographics?.top_locations || [],
            genderSplit: profile.audience_demographics?.gender_split || { female: 50, male: 50, other: 0 },
            topInterests: profile.audience_demographics?.top_interests || [],
          },
          portfolio: profile.portfolio || [],
          verifiedCampaigns: [],
        };
        setActiveCreator(creatorObj);
        db.saveCreator(creatorObj);
        setCreators(prev => {
          const exists = prev.some(c => c.id === creatorObj.id);
          return exists ? prev.map(c => c.id === creatorObj.id ? creatorObj : c) : [creatorObj, ...prev];
        });
        db.saveSession({
          isAuthenticated: true,
          role: 'creator',
          entityId: creatorObj.id,
          userId: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        });
      }

      addToast({
        title: `Welcome, ${user.name}! 👋`,
        message: `Signed in to your ${resolvedRole === 'brand' ? 'Brand dashboard' : 'Creator account'}.`,
        type: 'success',
      });

      return { success: true, role: resolvedRole };
    } catch (err: any) {
      console.error('validateAndLogin API error:', err);
      return { success: false, message: 'Server communication error. Please try again.' };
    }
  };

  const logoutUser = () => {
    if (currentUser?.id) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id }),
      }).catch(() => {});
    }
    db.clearSession();
    setIsAuthenticated(false);
    setCurrentUser({
      id: '',
      name: '',
      email: '',
      role: 'brand',
      avatar: '',
    });
    addToast({
      title: 'Logged Out',
      message: 'You have signed out of your session.',
      type: 'info',
    });
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Campaigns
  const addCampaign = async (newCampaign: Campaign) => {
    try {
      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_id: newCampaign.brandId || activeBrand.id,
          brand_name: newCampaign.brandName || activeBrand.name,
          brand_logo: newCampaign.brandLogo || activeBrand.logo,
          name: newCampaign.name,
          product: newCampaign.product,
          category: newCampaign.category,
          description: newCampaign.description,
          product_image: newCampaign.productImage,
          objective: newCampaign.objective,
          target_audience: newCampaign.targetAudience,
          required_platforms: newCampaign.requirements?.platforms || ['Instagram', 'YouTube'],
          deliverables: newCampaign.deliverables,
          guidelines: newCampaign.guidelines,
          timeline: newCampaign.timeline,
          budget: newCampaign.budget,
          reward_display: newCampaign.rewardDisplay,
          deadline_display: newCampaign.deadlineDisplay,
          invited_creator_ids: newCampaign.invitedCreatorIds,
          accepted_creator_ids: newCampaign.acceptedCreatorIds,
        }),
      });
    } catch (err) {
      console.warn('API save campaign warning:', err);
    }
    db.saveCampaign(newCampaign);
    setCampaigns(prev => [newCampaign, ...prev]);
    addToast({
      title: 'Campaign Launched! 🚀',
      message: `${newCampaign.name} is now live and accepting AI creator matches.`,
      type: 'success',
    });
  };

  const inviteCreatorToCampaign = (campaignId: string, creatorId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              invitedCreatorIds: Array.from(new Set([...c.invitedCreatorIds, creatorId])),
            }
          : c
      )
    );

    const creator = creators.find(cr => cr.id === creatorId);
    addToast({
      title: 'Invitation Sent ✨',
      message: `Invited ${creator?.name || 'Creator'} with custom AI match brief.`,
      type: 'success',
    });

    // Add notification for creator
    setNotifications(prev => [
      {
        id: Math.random().toString(),
        title: 'Campaign Invitation 💌',
        message: `GlowRush invited you to collaborate on the Summer Glow Campaign!`,
        type: 'invite',
        date: 'Just now',
        read: false,
        actionUrl: `/creator/campaigns/${campaignId}`,
      },
      ...prev,
    ]);
  };

  const acceptCampaignInvitation = (campaignId: string, creatorId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              acceptedCreatorIds: Array.from(new Set([...c.acceptedCreatorIds, creatorId])),
              invitedCreatorIds: c.invitedCreatorIds.filter(id => id !== creatorId),
            }
          : c
      )
    );

    addToast({
      title: 'Campaign Accepted! 🎉',
      message: 'You have joined the campaign. Deliverables are now trackable.',
      type: 'success',
    });
  };

  const applyToCampaign = (
    campaignId: string,
    creatorId: string,
    details?: {
      deliverableType?: string;
      pitchVideoUrl?: string;
      pitchVideoTitle?: string;
      conceptPitch?: string;
      samplePostUrl?: string;
    }
  ) => {
    const camp = campaigns.find(c => c.id === campaignId);
    const creator = creators.find(c => c.id === creatorId) || activeCreator;
    if (!camp) return;

    const match = calculateMatchScore(camp, creator);

    const newApp: CampaignApplication = {
      id: `app-${Date.now()}`,
      campaignId,
      campaignName: camp.name,
      brandId: camp.brandId,
      brandName: camp.brandName,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorAvatar: creator.avatar,
      deliverableType: details?.deliverableType || camp.deliverables[0]?.type || 'Instagram Reel',
      pitchVideoUrl: details?.pitchVideoUrl || details?.samplePostUrl || creator.portfolio[0]?.thumbnail || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
      pitchVideoTitle: details?.pitchVideoTitle || 'Creator Campaign Proposal & Pitch Deliverable',
      conceptPitch: details?.conceptPitch || 'High-relevance authentic showcase aligned with campaign brief and technical requirements.',
      samplePostUrl: details?.samplePostUrl || details?.pitchVideoUrl,
      matchScore: match.overallScore,
      status: 'pending',
      appliedAt: 'Just now',
    };

    db.addCampaignApplication(newApp);
    setCampaignApplications(prev => [newApp, ...prev.filter(a => a.id !== newApp.id)]);

    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? {
              ...c,
              appliedCreatorIds: Array.from(new Set([...c.appliedCreatorIds, creatorId])),
            }
          : c
      )
    );

    // Send high-priority notification to brand
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Campaign Application & Pitch Video 🎥',
        message: `${creator.name} applied for "${camp.name}" with a pitch video (${match.overallScore}% AI fit).`,
        type: 'match',
        date: 'Just now',
        read: false,
        actionUrl: '/brand/campaigns',
      },
      ...prev,
    ]);

    addToast({
      title: 'Campaign Application & Pitch Dispatched! 🚀',
      message: `Your pitch video and ${match.overallScore}% AI match score are now waiting in ${camp.brandName}'s review queue.`,
      type: 'success',
    });
  };

  const acceptCampaignApplication = (applicationId: string) => {
    const targetApp = campaignApplications.find(a => a.id === applicationId);
    if (!targetApp) return;

    db.updateCampaignApplicationStatus(applicationId, 'accepted');
    setCampaignApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'accepted' } : a))
    );

    // Update campaign acceptedCreatorIds
    setCampaigns(prev =>
      prev.map(c =>
        c.id === targetApp.campaignId
          ? {
              ...c,
              acceptedCreatorIds: Array.from(new Set([...c.acceptedCreatorIds, targetApp.creatorId])),
            }
          : c
      )
    );

    // Automatically connect brand and creator
    db.sendConnectionRequest({
      senderId: targetApp.brandId,
      senderName: targetApp.brandName,
      senderAvatar: activeBrand.logo,
      senderRole: 'brand',
      receiverId: targetApp.creatorId,
      receiverName: targetApp.creatorName,
      receiverAvatar: targetApp.creatorAvatar,
      receiverRole: 'creator',
      note: `We accepted your pitch for ${targetApp.campaignName}! Let's start the campaign!`,
    });
    const connList = db.getConnections();
    const createdConn = connList.find(
      c => (c.senderId === targetApp.brandId && c.receiverId === targetApp.creatorId) ||
           (c.senderId === targetApp.creatorId && c.receiverId === targetApp.brandId)
    );
    if (createdConn) {
      db.acceptConnectionRequest(createdConn.id);
      setConnections(db.getConnections());
    }

    // Add private conversation and persist to database
    const convId = `conv-${targetApp.brandId}-${targetApp.creatorId}`;
    const newConv: Conversation = {
      id: convId,
      creatorId: targetApp.creatorId,
      creatorName: targetApp.creatorName,
      creatorAvatar: targetApp.creatorAvatar,
      brandId: targetApp.brandId,
      brandName: targetApp.brandName,
      brandLogo: activeBrand.logo,
      participantId: targetApp.creatorId,
      participantName: targetApp.creatorName,
      participantAvatar: targetApp.creatorAvatar,
      participantRole: 'creator',
      lastMessage: `Accepted proposal for ${targetApp.campaignName}!`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
      campaignContext: {
        id: targetApp.campaignId,
        name: targetApp.campaignName,
      },
    };
    db.saveConversation(newConv);
    setConversations(prev => {
      if (prev.some(c => c.id === convId)) return prev;
      return [newConv, ...prev];
    });

    // Notify Creator
    setNotifications(prev => [
      {
        id: `notif-acc-${Date.now()}`,
        title: 'Pitch Accepted! 🎉',
        message: `${targetApp.brandName} accepted your application for ${targetApp.campaignName}! Direct messaging is unlocked.`,
        type: 'approval',
        date: 'Just now',
        read: false,
        actionUrl: '/creator/campaigns',
      },
      ...prev,
    ]);

    addToast({
      title: 'Creator Application Accepted! 🤝',
      message: `${targetApp.creatorName} is now hired for ${targetApp.campaignName}. Direct chat unlocked!`,
      type: 'success',
    });
  };

  const declineCampaignApplication = (applicationId: string) => {
    db.updateCampaignApplicationStatus(applicationId, 'declined');
    setCampaignApplications(prev =>
      prev.map(a => (a.id === applicationId ? { ...a, status: 'declined' } : a))
    );
    addToast({
      title: 'Application Declined',
      message: 'The creator application has been declined.',
      type: 'info',
    });
  };

  const getCreatorById = (id: string) => creators.find(c => c.id === id);

  // Content Submission
  const submitContent = (
    data: Omit<Submission, 'id' | 'submissionDate' | 'status' | 'aiQualityScore' | 'aiBreakdown' | 'aiFeedback'>
  ): Submission => {
    const evalResult = evaluateContent(data.caption, data.mediaUrl, data.productMention);
    const newSub: Submission = {
      ...data,
      id: `sub-${Date.now()}`,
      submissionDate: 'Just now',
      status: 'under_review',
      aiQualityScore: evalResult.overallScore,
      aiBreakdown: evalResult.breakdown,
      aiFeedback: evalResult.feedback,
    };

    setSubmissions(prev => [newSub, ...prev]);

    addToast({
      title: 'Content Submitted 🎬',
      message: `AI Creative Score: ${evalResult.overallScore}/100. Ready for brand review.`,
      type: 'success',
    });

    return newSub;
  };

  const approveSubmission = (submissionId: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, status: 'approved' } : s))
    );

    // Award Creator Credits (+100)
    const newCreditItem: CreatorCreditItem = {
      id: `cred-${Date.now()}`,
      creatorId: 'creator-ananya',
      amount: 100,
      type: 'earned',
      description: 'Campaign completed & approved — Glow Serum',
      date: 'Just now',
      badge: 'Deliverable ✓',
      source: 'campaign_completed',
    };

    setCreatorCredits(prev => prev + 100);
    setCreditsHistory(prev => [newCreditItem, ...prev]);

    // Update creator verified campaign record
    setActiveCreator(prev => ({
      ...prev,
      creatorCredits: prev.creatorCredits + 100,
      completedCampaigns: prev.completedCampaigns + 1,
      verifiedCampaigns: [
        {
          id: `vcamp-${Date.now()}`,
          brandName: 'GlowRush',
          brandLogo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
          campaignName: 'Summer Glow Campaign',
          badge: 'Winner 🏆',
          reach: '250K',
          engagement: '8.4%',
          year: '2025',
          testimonial: 'High aesthetic quality and verified conversion delivery.',
        },
        ...prev.verifiedCampaigns,
      ],
    }));

    addToast({
      title: 'Submission Approved! ✅',
      message: 'Creator has been awarded +100 Creator Credits and verified portfolio badge.',
      type: 'success',
    });

    setNotifications(prev => [
      {
        id: Math.random().toString(),
        title: 'Submission Approved! ⭐',
        message: 'GlowRush approved your content! You earned +100 Creator Credits.',
        type: 'approval',
        date: 'Just now',
        read: false,
        actionUrl: '/creator/credits',
      },
      ...prev,
    ]);
  };

  const requestChangesSubmission = (submissionId: string, note?: string) => {
    setSubmissions(prev =>
      prev.map(s => (s.id === submissionId ? { ...s, status: 'changes_requested' } : s))
    );

    addToast({
      title: 'Changes Requested ✏️',
      message: 'Feedback sent to creator with updated deliverable checklist.',
      type: 'warning',
    });
  };

  // Challenges
  const createChallenge = (newChal: Challenge) => {
    setChallenges(prev => [newChal, ...prev]);
    setChallengeEntries(prev => ({
      ...prev,
      [newChal.id]: [],
    }));
    addToast({
      title: 'Meme Challenge Created! 🔥',
      message: `${newChal.name} is now open for creator submissions.`,
      type: 'success',
    });
  };

  const submitChallengeEntry = (
    data: Omit<ChallengeEntry, 'id' | 'submittedAt' | 'rank' | 'votes' | 'engagement' | 'aiScore'>
  ) => {
    const existing = challengeEntries[data.challengeId] || [];
    const newEntry: ChallengeEntry = {
      ...data,
      id: `entry-${Date.now()}`,
      submittedAt: 'Just now',
      rank: 1, // Ananya tops the leaderboard
      votes: 1480,
      engagement: 9.8,
      aiScore: 94,
    };

    const updated = [newEntry, ...existing.map(e => ({ ...e, rank: e.rank + 1 }))];

    setChallengeEntries(prev => ({
      ...prev,
      [data.challengeId]: updated,
    }));

    // Award participation credits (+50)
    const newCreditItem: CreatorCreditItem = {
      id: `cred-${Date.now()}`,
      creatorId: 'creator-ananya',
      amount: 50,
      type: 'earned',
      description: 'Challenge entry submitted — GlowRush Glow-Up',
      date: 'Just now',
      badge: 'Entry',
      source: 'challenge_participation',
    };
    setCreatorCredits(prev => prev + 50);
    setCreditsHistory(prev => [newCreditItem, ...prev]);

    addToast({
      title: 'Challenge Entry Submitted! 🎨',
      message: 'Your entry scored 94 on AI Creative Ranking and earned +50 credits!',
      type: 'success',
    });
  };

  const awardChallengeWinner = (challengeId: string, winnerEntryId: string) => {
    setChallengeEntries(prev => {
      const list = prev[challengeId] || [];
      return {
        ...prev,
        [challengeId]: list.map(entry =>
          entry.id === winnerEntryId ? { ...entry, isWinner: true, rank: 1 } : entry
        ),
      };
    });

    // Award +500 Creator Credits
    const newCreditItem: CreatorCreditItem = {
      id: `cred-win-${Date.now()}`,
      creatorId: 'creator-ananya',
      amount: 500,
      type: 'earned',
      description: '1st Place Challenge Winner — GlowRush Glow-Up',
      date: 'Just now',
      badge: 'Winner 🏆',
      source: 'challenge_winner',
    };

    setCreatorCredits(prev => prev + 500);
    setCreditsHistory(prev => [newCreditItem, ...prev]);

    // Unlock Campaign Winner achievement
    unlockAchievement('ach-winner');

    addToast({
      title: 'Winner Awarded! 🏆',
      message: 'Awarded 1st place! Creator received +500 Credits & unlocked Campaign Winner trophy!',
      type: 'success',
    });
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev =>
      prev.map(ach =>
        ach.id === id ? { ...ach, unlocked: true, unlockedAt: 'Just now', progress: ach.maxProgress } : ach
      )
    );
  };

  // Messaging
  const sendMessage = (conversationId: string, text: string) => {
    if (!text.trim()) return;

    const senderName = currentUser?.name || (role === 'brand' ? activeBrand.name : activeCreator.name);
    const senderAvatar = currentUser?.avatar || (role === 'brand' ? activeBrand.logo : activeCreator.avatar);
    const senderId = currentUser?.id || (role === 'brand' ? activeBrand.id : activeCreator.id);

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      senderRole: role,
      text: text.trim(),
      timestamp: 'Just now',
    };

    // 1. Save to local persistent database
    db.saveMessage(conversationId, newMsg);

    // 2. Update React in-memory state
    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));

    // 3. Update conversation last message in state and database
    setConversations(prev => {
      const updated = prev.map(c =>
        c.id === conversationId ? { ...c, lastMessage: text.trim(), lastMessageTime: 'Just now' } : c
      );
      const targetConv = updated.find(c => c.id === conversationId);
      if (targetConv) {
        db.saveConversation(targetConv);
      }
      return updated;
    });

    // 4. Background server sync
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId,
        senderId,
        senderName,
        senderAvatar,
        senderRole: role,
        text: text.trim(),
        timestamp: 'Just now',
      }),
    }).catch(err => console.warn('Message API sync warning:', err));
  };

  const startOrGetConversation = (
    brandId: string,
    creatorId: string,
    campaignContext?: { id: string; name: string }
  ): string => {
    const convId = `conv-${brandId}-${creatorId}`;
    const targetBrand = brands.find(b => b.id === brandId) || activeBrand;
    const targetCreator = creators.find(c => c.id === creatorId) || activeCreator;

    setConversations(prev => {
      const existing = prev.find(c => c.id === convId || (c.brandId === brandId && c.creatorId === creatorId));
      if (existing) {
        setActiveConversationId(existing.id);
        return prev;
      }

      const newConv: Conversation = {
        id: convId,
        brandId,
        brandName: targetBrand.name,
        brandLogo: targetBrand.logo,
        creatorId,
        creatorName: targetCreator.name,
        creatorAvatar: targetCreator.avatar,
        participantId: role === 'brand' ? creatorId : brandId,
        participantName: role === 'brand' ? targetCreator.name : targetBrand.name,
        participantAvatar: role === 'brand' ? targetCreator.avatar : targetBrand.logo,
        participantRole: role === 'brand' ? 'creator' : 'brand',
        lastMessage: campaignContext ? `Discussing ${campaignContext.name}` : 'Direct chat unlocked!',
        lastMessageTime: 'Just now',
        unreadCount: 0,
        campaignContext,
      };

      db.saveConversation(newConv);
      setActiveConversationId(newConv.id);
      return [newConv, ...prev];
    });

    setActiveConversationId(convId);
    return convId;
  };

  // Notifications
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info',
    });
  };

  // Sustainability & Database Management
  const updateBrandSustainability = (data: {
    waterEmissionLiters?: number;
    waterEmissionSavedLiters?: number;
    diapersCount?: number;
    diapersDistributed?: number;
    diaperType?: string;
    ecoScore?: number;
    notes?: string;
  }) => {
    const updated = db.updateBrandSustainability(activeBrand.id, data);
    if (updated) {
      setActiveBrand(updated);
      setSustainabilityRecords(db.getSustainabilityRecords());
      addToast({
        title: 'Sustainability & Diapers Saved! 💧',
        message: `Database updated: ${(updated.sustainability?.diapersCount ?? 0).toLocaleString()} Diapers tracked, ${(updated.sustainability?.waterEmissionSavedLiters ?? 0).toLocaleString()}L Water saved.`,
        type: 'success',
      });
    }
  };

  const updateCreatorSustainability = (data: {
    waterEmissionSavedLiters: number;
    ecoScore?: number;
    notes?: string;
  }) => {
    const updated = db.updateCreatorSustainability(activeCreator.id, data);
    if (updated) {
      setActiveCreator(updated);
      setSustainabilityRecords(db.getSustainabilityRecords());
      addToast({
        title: 'Water Footprint Offset Saved! 💧',
        message: `Database updated: ${data.waterEmissionSavedLiters.toLocaleString()} Liters water emission offset recorded!`,
        type: 'success',
      });
    }
  };

  const updateCreatorProfile = (data: Partial<Creator>) => {
    setActiveCreator(prev => {
      const merged: Creator = { ...prev, ...data };
      db.saveCreator(merged);
      return merged;
    });
    setCreators(prev => prev.map(c => c.id === activeCreator.id ? { ...c, ...data } : c));
    addToast({
      title: 'Creator Profile Saved ✨',
      message: 'Your profile details, niche taxonomy, and social handles have been saved.',
      type: 'success',
    });
  };

  const setActiveBrandById = (id: string) => {
    const found = db.getBrand(id) || mockBrands.find(b => b.id === id);
    if (found) {
      setActiveBrand(found);
      addToast({
        title: `Active Brand: ${found.name}`,
        message: `Viewing dashboard as ${found.name}.`,
        type: 'info',
      });
    }
  };

  const setActiveCreatorById = (id: string) => {
    const found = db.getCreator(id) || mockCreators.find(c => c.id === id);
    if (found) {
      setActiveCreator(found);
    }
  };

  // Real API-backed Brand & Creator Registration
  const registerNewBrand = async (data: {
    name: string;
    industry: string;
    operatingDuration: string;
    location: string;
    website?: string;
    description: string;
    targetAudience: string;
    products: { name: string; category: string; description: string; image: string }[];
    email?: string;
    password?: string;
  }): Promise<Brand> => {
    const brandEmail = (data.email || `${data.name.toLowerCase().replace(/\s+/g, '')}@brand.com`).trim().toLowerCase();
    const brandPassword = data.password || 'password123';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: brandEmail,
          password: brandPassword,
          role: 'brand',
          name: data.name,
          profileData: {
            industry: data.industry,
            operatingDuration: data.operatingDuration,
            location: data.location,
            website: data.website || '',
            description: data.description,
            targetAudience: data.targetAudience,
            products: data.products,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Brand registration failed');
      }

      const { user, profile } = json;
      const brandId = profile.id;
      const newBrand: Brand = {
        id: brandId,
        name: data.name,
        logo: user.avatar || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
        description: data.description,
        website: data.website || `https://${data.name.toLowerCase().replace(/\s+/g, '')}.com`,
        industry: data.industry,
        location: data.location,
        operatingDuration: data.operatingDuration,
        targetAudience: data.targetAudience,
        products: (data.products || []).map((p, idx) => ({
          id: `prod-${Date.now()}-${idx}`,
          name: p.name,
          category: p.category,
          description: p.description,
          image: p.image || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
        })),
        stats: {
          activeCampaigns: 0,
          creatorsCollaborating: 0,
          totalReach: '0',
          avgEngagement: '0%',
          conversions: 0,
          roi: '0x',
        },
      };

      db.addBrand(newBrand);
      setBrands(prev => [newBrand, ...prev]);
      setActiveBrand(newBrand);
      setRoleState('brand');
      setIsAuthenticated(true);
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'brand',
        avatar: user.avatar,
      });

      db.saveSession({
        isAuthenticated: true,
        role: 'brand',
        entityId: newBrand.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });

      addToast({
        title: `Welcome, ${newBrand.name}! 🎉`,
        message: 'Your brand company profile is now live on CreatorMatch.',
        type: 'success',
      });
      return newBrand;
    } catch (err: any) {
      console.error('registerNewBrand error:', err);
      throw err;
    }
  };

  const registerNewCreator = async (data: {
    name: string;
    email?: string;
    avatar?: string;
    handle: string;
    bio: string;
    location: string;
    languages: string[];
    niche: string[];
    categories: string[];
    socialUrls: { instagram?: string; youtube?: string; tiktok?: string };
    highestFollowers: number;
    highestFollowersDisplay: string;
    engagementRate: number;
    portfolio: PortfolioItem[];
    pastBrandsWorkedWith?: string[];
    password?: string;
  }): Promise<Creator> => {
    const creatorEmail = (data.email || `${data.handle.replace('@', '')}@creatormatch.ai`).trim().toLowerCase();
    const creatorPassword = data.password || 'password123';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: creatorEmail,
          password: creatorPassword,
          role: 'creator',
          name: data.name,
          profileData: {
            avatar: data.avatar,
            handle: data.handle,
            bio: data.bio,
            location: data.location,
            languages: data.languages,
            niche: data.niche,
            categories: data.categories,
            followers: data.highestFollowers,
            followersDisplay: data.highestFollowersDisplay,
            engagementRate: data.engagementRate,
            portfolio: data.portfolio,
            pastBrandsWorkedWith: data.pastBrandsWorkedWith || [],
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Creator registration failed');
      }

      const { user, profile } = json;
      const creatorId = profile.id;
      const newCreator: Creator = {
        id: creatorId,
        name: data.name,
        email: creatorEmail,
        handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
        avatar: data.avatar || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: data.bio,
        niche: data.niche,
        categories: data.categories,
        location: data.location,
        languages: data.languages,
        socialPlatforms: [
          {
            platform: 'instagram',
            handle: data.handle,
            url: data.socialUrls.instagram || 'https://instagram.com',
            followers: data.highestFollowers,
            engagement: data.engagementRate,
          },
        ],
        socialUrls: data.socialUrls,
        highestFollowers: data.highestFollowers,
        highestFollowersDisplay: data.highestFollowersDisplay,
        pastBrandsWorkedWith: data.pastBrandsWorkedWith || [],
        followers: data.highestFollowers,
        followersDisplay: data.highestFollowersDisplay,
        avgViews: `${Math.round(data.highestFollowers * 0.45).toLocaleString()}`,
        engagementRate: data.engagementRate,
        engagementDisplay: `${data.engagementRate}%`,
        creatorScore: 92,
        creatorCredits: 100,
        campaignWins: 0,
        completedCampaigns: 0,
        totalReach: `${data.highestFollowersDisplay}`,
        verified: true,
        audience: {
          ageBreakdown: { '18-24': 50, '25-34': 35, '35+': 15 },
          topLocations: [`${data.location} (50%)`, 'Metro Hubs (30%)', 'Other (20%)'],
          genderSplit: { female: 65, male: 30, other: 5 },
          topInterests: data.niche,
        },
        portfolio: data.portfolio,
        verifiedCampaigns: [],
      };

      db.addCreator(newCreator);
      setCreators(prev => [newCreator, ...prev]);
      setActiveCreator(newCreator);
      setRoleState('creator');
      setIsAuthenticated(true);
      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'creator',
        avatar: user.avatar,
      });

      db.saveSession({
        isAuthenticated: true,
        role: 'creator',
        entityId: newCreator.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      });

      addToast({
        title: `Welcome, ${newCreator.name}! 🎉`,
        message: 'Your professional creator portfolio is now live on CreatorMatch.',
        type: 'success',
      });
      return newCreator;
    } catch (err: any) {
      console.error('registerNewCreator error:', err);
      throw err;
    }
  };

  const addCreatorPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
    };
    const updated = db.addPortfolioItem(activeCreator.id, newItem);
    if (updated) {
      setActiveCreator(updated);
      setCreators(prev => prev.map(c => c.id === updated.id ? updated : c));
    } else {
      setActiveCreator(prev => ({
        ...prev,
        portfolio: [newItem, ...prev.portfolio],
      }));
    }
    addToast({
      title: 'Portfolio Item Added! 🎬',
      message: `"${item.title}" is now live on your CreatorMatch profile.`,
      type: 'success',
    });
  };

  const switchAccount = (targetRole: Role, id: string) => {
    if (targetRole === 'brand') {
      const b = brands.find(item => item.id === id);
      if (b) {
        setActiveBrand(b);
        setRoleState('brand');
        addToast({
          title: `Switched to Brand: ${b.name}`,
          message: `Viewing brand management and creator portfolios.`,
          type: 'info',
        });
      }
    } else {
      const c = creators.find(item => item.id === id);
      if (c) {
        setActiveCreator(c);
        setRoleState('creator');
        addToast({
          title: `Switched to Creator: ${c.name}`,
          message: `Viewing your creator profile and portfolio.`,
          type: 'info',
        });
      }
    }
  };

  // Connection Networking Methods
  const sendConnectionRequest = (targetId: string, note?: string) => {
    const isBrand = role === 'brand';
    const targetBrand = brands.find(b => b.id === targetId);
    const targetCreator = creators.find(c => c.id === targetId);

    const senderId = isBrand ? activeBrand.id : activeCreator.id;
    const senderName = isBrand ? activeBrand.name : activeCreator.name;
    const senderAvatar = isBrand ? activeBrand.logo : activeCreator.avatar;
    const senderRole = role;

    const receiverId = targetId;
    const receiverName = targetBrand?.name || targetCreator?.name || 'Partner';
    const receiverAvatar = targetBrand?.logo || targetCreator?.avatar || '';
    const receiverRole = targetBrand ? 'brand' : 'creator';

    db.sendConnectionRequest({
      senderId,
      senderName,
      senderAvatar,
      senderRole,
      receiverId,
      receiverName,
      receiverAvatar,
      receiverRole,
      note: note || `Hi ${receiverName}, let's connect on CreatorMatch to explore high-synergy collaborations!`,
    });

    setConnections(db.getConnections());
    addToast({
      title: 'Connection Request Sent 🤝',
      message: `Your request was sent to ${receiverName}. Direct messaging will be unlocked once accepted!`,
      type: 'success',
    });
  };

  const acceptConnectionRequest = (requestId: string) => {
    db.acceptConnectionRequest(requestId);
    const updatedConns = db.getConnections();
    setConnections(updatedConns);
    const req = updatedConns.find(c => c.id === requestId) || connections.find(c => c.id === requestId);
    if (req) {
      const bId = req.senderRole === 'brand' ? req.senderId : req.receiverId;
      const cId = req.senderRole === 'creator' ? req.senderId : req.receiverId;
      startOrGetConversation(bId, cId);
    }
    const otherName = role === 'brand' ? req?.senderName : req?.receiverName;
    addToast({
      title: 'Connection Accepted! 🎉',
      message: `You are now connected with ${otherName || 'your partner'}. Direct messaging is now unlocked!`,
      type: 'success',
    });
  };

  const declineConnectionRequest = (requestId: string) => {
    db.declineConnectionRequest(requestId);
    setConnections(db.getConnections());
    addToast({
      title: 'Request Declined',
      message: 'Connection request removed.',
      type: 'info',
    });
  };

  const getConnectionStatus = (targetId: string): ConnectionStatus => {
    const currentId = role === 'brand' ? activeBrand.id : activeCreator.id;
    return db.getConnectionStatus(currentId, targetId);
  };

  const isUserConnected = (targetId: string): boolean => {
    return getConnectionStatus(targetId) === 'connected';
  };

  // Reset Demo State
  const resetDemoData = () => {
    db.resetAll();
    setCampaigns(mockCampaigns);
    setBrands(mockBrands);
    setCreators(mockCreators);
    setChallenges(mockChallenges);
    setChallengeEntries(mockChallengeEntries);
    setCreatorCredits(2450);
    setCreditsHistory(mockInitialCredits);
    setAchievements(mockAchievements);
    setSustainabilityRecords(db.getSustainabilityRecords());
    addToast({
      title: 'State Reset',
      message: 'All mock state & database tables have been re-initialized.',
      type: 'info',
    });
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        brands,
        activeBrand,
        registerNewBrand,
        creators,
        activeCreator,
        registerNewCreator,
        addCreatorPortfolioItem,
        switchAccount,
        campaigns,
        campaignApplications,
        addCampaign,
        inviteCreatorToCampaign,
        acceptCampaignInvitation,
        applyToCampaign,
        acceptCampaignApplication,
        declineCampaignApplication,
        getCreatorById,
        submissions,
        submitContent,
        approveSubmission,
        requestChangesSubmission,
        challenges,
        challengeEntries,
        createChallenge,
        submitChallengeEntry,
        awardChallengeWinner,
        creatorCredits,
        creditsHistory,
        achievements,
        unlockAchievement,
        conversations,
        activeConversationId,
        setActiveConversationId,
        messages,
        sendMessage,
        startOrGetConversation,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        toasts,
        addToast,
        removeToast,
        updateBrandSustainability,
        updateCreatorSustainability,
        updateCreatorProfile,
        setActiveBrandById,
        setActiveCreatorById,
        sustainabilityRecords,
        resetDemoData,
        connections,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        getConnectionStatus,
        isUserConnected,
        isAuthenticated,
        isAuthReady,
        loginUser,
        validateAndLogin,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
