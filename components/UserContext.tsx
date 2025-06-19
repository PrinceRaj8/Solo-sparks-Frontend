import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  personalityType: string;
  emotionalNeeds: string[];
  interests: string[];
  goals: string[];
  currentMood: string;
  sparkPoints: number;
  level: number;
  completedQuests: number;
  streak: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'self-reflection' | 'mindfulness' | 'creativity' | 'social' | 'adventure' | 'wellness';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  duration: string;
  instructions: string[];
  completed: boolean;
  completedAt?: Date;
  isPersonalized?: boolean;
}

export interface Reflection {
  id: string;
  questId: string;
  questTitle: string;
  text?: string;
  photoUri?: string;
  audioUri?: string;
  mood: string;
  createdAt: Date;
  points: number;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  type: 'profile-boost' | 'exclusive-content' | 'custom-prompt' | 'surprise-token';
  unlocked: boolean;
  redeemed: boolean;
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  quests: Quest[];
  updateQuest: (questId: string, updates: Partial<Quest>) => Promise<void>;
  completeQuest: (questId: string) => Promise<void>;
  reflections: Reflection[];
  addReflection: (reflection: Omit<Reflection, 'id' | 'createdAt'>) => Promise<void>;
  rewards: Reward[];
  redeemReward: (rewardId: string) => Promise<void>;
  addSparkPoints: (points: number) => void;
  updateMood: (mood: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [questsResponse, reflectionsResponse, rewardsResponse] = await Promise.all([
        apiService.getPersonalizedQuests(),
        apiService.getReflections(),
        apiService.getRewards(),
      ]);

      if (questsResponse.success && questsResponse.data) {
        setQuests(questsResponse.data.map((quest: any) => ({
          ...quest,
          completedAt: quest.completedAt ? new Date(quest.completedAt) : undefined,
        })));
      }

      if (reflectionsResponse.success && reflectionsResponse.data) {
        setReflections(reflectionsResponse.data.map((reflection: any) => ({
          ...reflection,
          createdAt: new Date(reflection.createdAt),
        })));
      }

      if (rewardsResponse.success && rewardsResponse.data) {
        setRewards(rewardsResponse.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;

    try {
      const response = await apiService.updateProfile(updates);
      
      if (response.success && response.data) {
        updateUser(response.data);
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    }
  };

  const updateQuest = async (questId: string, updates: Partial<Quest>) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, ...updates } : quest
    ));
  };

  const completeQuest = async (questId: string) => {
    try {
      const response = await apiService.completeQuest(questId);
      
      if (response.success) {
        // Update local quest state
        setQuests(prev => prev.map(quest => 
          quest.id === questId 
            ? { ...quest, completed: true, completedAt: new Date() }
            : quest
        ));

        // Update user points and stats
        const quest = quests.find(q => q.id === questId);
        if (quest && user) {
          updateUser({
            sparkPoints: user.sparkPoints + quest.points,
            completedQuests: user.completedQuests + 1,
            level: Math.floor((user.sparkPoints + quest.points) / 100) + 1,
          });
        }

        // Track behavior
        await apiService.trackBehavior({
          action: 'quest_completed',
          questId,
          metadata: { points: quest?.points },
        });
      } else {
        throw new Error(response.error || 'Failed to complete quest');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete quest');
      throw err;
    }
  };

  const addReflection = async (reflection: Omit<Reflection, 'id' | 'createdAt'>) => {
    try {
      const response = await apiService.createReflection({
        questId: reflection.questId,
        text: reflection.text,
        mood: reflection.mood,
        photoUri: reflection.photoUri,
        audioUri: reflection.audioUri,
      });

      if (response.success && response.data) {
        const newReflection = {
          ...response.data,
          createdAt: new Date(response.data.createdAt),
        };
        
        setReflections(prev => [newReflection, ...prev]);

        // Add bonus points for reflection
        if (user) {
          updateUser({
            sparkPoints: user.sparkPoints + reflection.points,
          });
        }

        // Track behavior
        await apiService.trackBehavior({
          action: 'reflection_created',
          questId: reflection.questId,
          metadata: { mood: reflection.mood, points: reflection.points },
        });
      } else {
        throw new Error(response.error || 'Failed to add reflection');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add reflection');
      throw err;
    }
  };

  const redeemReward = async (rewardId: string) => {
    try {
      const response = await apiService.redeemReward(rewardId);
      
      if (response.success) {
        // Update local reward state
        setRewards(prev => prev.map(reward => 
          reward.id === rewardId ? { ...reward, redeemed: true } : reward
        ));

        // Deduct points from user
        const reward = rewards.find(r => r.id === rewardId);
        if (reward && user) {
          updateUser({
            sparkPoints: user.sparkPoints - reward.cost,
          });
        }

        // Track behavior
        await apiService.trackBehavior({
          action: 'reward_redeemed',
          metadata: { rewardId, cost: reward?.cost },
        });
      } else {
        throw new Error(response.error || 'Failed to redeem reward');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem reward');
      throw err;
    }
  };

  const addSparkPoints = (points: number) => {
    if (user) {
      updateUser({
        sparkPoints: user.sparkPoints + points,
        level: Math.floor((user.sparkPoints + points) / 100) + 1,
      });
    }
  };

  const updateMood = async (mood: string) => {
    try {
      const response = await apiService.updateMood(mood);
      
      if (response.success) {
        updateUser({ currentMood: mood });
        
        // Track behavior
        await apiService.trackBehavior({
          action: 'mood_updated',
          metadata: { mood },
        });
      } else {
        throw new Error(response.error || 'Failed to update mood');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mood');
      throw err;
    }
  };

  return (
    <UserContext.Provider value={{
      profile: user,
      updateProfile,
      quests,
      updateQuest,
      completeQuest,
      reflections,
      addReflection,
      rewards,
      redeemReward,
      addSparkPoints,
      updateMood,
      refreshData,
      isLoading,
      error,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
