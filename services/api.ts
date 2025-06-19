const API_BASE_URL = 'https://solo-sparks-backend-3.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string;
    email: string;
    password: string;
    age: number;
    personalityType: string;
    emotionalNeeds: string[];
    interests: string[];
    goals: string[];
    currentMood: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User profile endpoints
  async getProfile() {
    return this.request<any>('/users/profile');
  }

  async updateProfile(updates: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async updateMood(mood: string) {
    return this.request<any>('/users/mood', {
      method: 'PUT',
      body: JSON.stringify({ mood }),
    });
  }

  // Quest endpoints
  async getQuests() {
    return this.request<any[]>('/quests');
  }

  async getPersonalizedQuests() {
    return this.request<any[]>('/quests/personalized');
  }

  async completeQuest(questId: string) {
    return this.request<any>(`/quests/${questId}/complete`, {
      method: 'POST',
    });
  }

  async getUserQuests() {
    return this.request<any[]>('/quests/user');
  }

  // Reflection endpoints
  async getReflections() {
    return this.request<any[]>('/reflections');
  }

  async createReflection(reflectionData: {
    questId: string;
    text?: string;
    mood: string;
    photoUri?: string;
    audioUri?: string;
  }) {
    return this.request<any>('/reflections', {
      method: 'POST',
      body: JSON.stringify(reflectionData),
    });
  }

  async deleteReflection(reflectionId: string) {
    return this.request(`/reflections/${reflectionId}`, {
      method: 'DELETE',
    });
  }

  // Rewards endpoints
  async getRewards() {
    return this.request<any[]>('/rewards');
  }

  async redeemReward(rewardId: string) {
    return this.request<any>(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
    });
  }

  // Analytics endpoints
  async getAnalytics() {
    return this.request<any>('/analytics');
  }

  async trackBehavior(behaviorData: {
    action: string;
    questId?: string;
    metadata?: any;
  }) {
    return this.request('/analytics/behavior', {
      method: 'POST',
      body: JSON.stringify(behaviorData),
    });
  }

  // File upload endpoint
  async uploadFile(file: FormData) {
    const url = `${API_BASE_URL}/upload`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }
}

export const apiService = new ApiService();
export default apiService;
