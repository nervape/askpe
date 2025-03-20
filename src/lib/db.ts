import { FeedEvent, SharedResponse } from './types';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Event bus for real-time updates
class EventBus {
  private listeners: { [key: string]: ((data: unknown) => void)[] } = {};

  subscribe(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  unsubscribe(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  publish(event: string, data: unknown) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

// Create an event bus singleton
export const eventBus = new EventBus();

// Generate a persistent user ID
function getUserId(): string {
  if (!isBrowser) return 'server';
  
  let userId = localStorage.getItem('ape_oracle_user_id');
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ape_oracle_user_id', userId);
  }
  return userId;
}

// Initialize userId only in browser context
export const currentUserId = isBrowser ? getUserId() : 'server';

// Simple response type for like updates
interface LikeUpdate {
  responseId: string;
  likeCount: number;
  isLiked: boolean;
}

// Get user liked response IDs from localStorage
function getUserLikedIds(): Set<string> {
  if (!isBrowser) return new Set();
  
  try {
    const likedIds = localStorage.getItem('ape_oracle_user_liked_ids');
    if (likedIds) {
      return new Set(JSON.parse(likedIds));
    }
  } catch (e) {
    console.error('Error loading liked IDs from localStorage:', e);
  }
  
  return new Set();
}

// Save user liked response IDs to localStorage
function saveUserLikedIds(likedIds: Set<string>): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem('ape_oracle_user_liked_ids', JSON.stringify(Array.from(likedIds)));
  } catch (e) {
    console.error('Error saving liked IDs to localStorage:', e);
  }
}

// Simulated database with in-memory storage
// In a real app, this would be replaced with a proper database
class FeedDatabase {
  private responses: SharedResponse[] = [];
  private userLikes: Map<string, Set<string>> = new Map(); // responseId -> Set of userIds
  private currentUserLikedIds: Set<string> = getUserLikedIds(); // Only IDs of responses liked by current user
  
  constructor() {
    if (isBrowser) {
      // Only run these in the browser
      this.loadFromStorage();
      
      // Save to localStorage when window unloads
      window.addEventListener('beforeunload', () => {
        this.saveToStorage();
      });
    }
  }
  
  private loadFromStorage() {
    if (!isBrowser) return;
    
    try {
      const savedResponses = localStorage.getItem('ape_oracle_responses');
      if (savedResponses) {
        this.responses = JSON.parse(savedResponses);
      }
      
      // Load user likes for the current user
      this.currentUserLikedIds = getUserLikedIds();
      
      // Initialize server-side user likes map for like count tracking
      this.currentUserLikedIds.forEach(responseId => {
        if (!this.userLikes.has(responseId)) {
          this.userLikes.set(responseId, new Set([currentUserId]));
        } else {
          this.userLikes.get(responseId)!.add(currentUserId);
        }
      });
    } catch (e) {
      console.error('Error loading from localStorage:', e);
    }
  }
  
  private saveToStorage() {
    if (!isBrowser) return;
    
    try {
      localStorage.setItem('ape_oracle_responses', JSON.stringify(this.responses));
      
      // Save current user's liked IDs
      saveUserLikedIds(this.currentUserLikedIds);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }
  
  async addResponse(response: Omit<SharedResponse, 'id' | 'timestamp' | 'likeCount'>) {
    // Check for duplicate response content
    const isDuplicate = this.responses.some(r => 
      r.responseContent === response.responseContent && 
      r.presetId === response.presetId && 
      r.languageId === response.languageId
    );
    
    if (isDuplicate) {
      // Return existing response but don't add a duplicate
      const existingResponse = this.responses.find(r => 
        r.responseContent === response.responseContent && 
        r.presetId === response.presetId &&
        r.languageId === response.languageId
      );
      return existingResponse;
    }
    
    const newResponse: SharedResponse = {
      ...response,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date(),
      likeCount: 0
    };
    
    this.responses.push(newResponse);
    
    // Publish event
    const event: FeedEvent = {
      type: 'new-response',
      data: newResponse,
      timestamp: Date.now()
    };
    
    eventBus.publish('feed-update', event);
    
    // Save to localStorage if in browser context
    if (isBrowser) {
      this.saveToStorage();
    }
    
    return newResponse;
  }
  
  // Get the accurate count of likes for a response
  private getResponseLikeCount(responseId: string): number {
    const userLikesForResponse = this.userLikes.get(responseId);
    return userLikesForResponse ? userLikesForResponse.size : 0;
  }
  
  // Check if the current user has liked a response
  isLikedByCurrentUser(responseId: string): boolean {
    return this.currentUserLikedIds.has(responseId);
  }
  
  async likeResponse(responseId: string, userId: string): Promise<LikeUpdate> {
    const response = this.responses.find(r => r.id === responseId);
    if (!response) {
      throw new Error(`Response with ID ${responseId} not found`);
    }
    
    // Check if user already liked this response
    if (!this.userLikes.has(responseId)) {
      this.userLikes.set(responseId, new Set());
    }
    
    const userLikesForResponse = this.userLikes.get(responseId)!;
    
    // Toggle like in server-side tracking
    const hasLiked = userLikesForResponse.has(userId);
    
    if (hasLiked) {
      userLikesForResponse.delete(userId);
      // Remove from current user's liked IDs if it's the current user
      if (userId === currentUserId) {
        this.currentUserLikedIds.delete(responseId);
      }
    } else {
      userLikesForResponse.add(userId);
      // Add to current user's liked IDs if it's the current user
      if (userId === currentUserId) {
        this.currentUserLikedIds.add(responseId);
      }
    }
    
    // Calculate the actual like count from the database
    const actualLikeCount = this.getResponseLikeCount(responseId);
    
    // Update the response with the accurate like count
    response.likeCount = actualLikeCount;
    
    // Create like update for response
    const likeUpdate: LikeUpdate = {
      responseId,
      likeCount: actualLikeCount,
      isLiked: !hasLiked
    };
    
    // Broadcast like update event to all clients
    eventBus.publish('feed-update', {
      type: 'like-update',
      data: {
        responseId,
        likeCount: actualLikeCount
      },
      timestamp: Date.now()
    });
    
    // Save to localStorage if in browser context
    if (isBrowser) {
      this.saveToStorage();
    }
    
    // Return like update to the client that performed the action
    return likeUpdate;
  }
  
  async getResponses() {
    // Return a copy sorted by newest first
    return [...this.responses].sort((a, b) => {
      // Convert to timestamps for comparison if needed
      const timestampA = a.timestamp instanceof Date ? a.timestamp.getTime() : a.timestamp;
      const timestampB = b.timestamp instanceof Date ? b.timestamp.getTime() : b.timestamp;
      return timestampB - timestampA;
    });
  }
  
  async getUserLikedResponses(userId: string) {
    // If it's the current user, return the cached liked IDs
    if (userId === currentUserId) {
      return this.currentUserLikedIds;
    }
    
    // Otherwise, calculate from the server-side tracking
    const likedResponseIds = new Set<string>();
    
    this.userLikes.forEach((userIds, responseId) => {
      if (userIds.has(userId)) {
        likedResponseIds.add(responseId);
      }
    });
    
    return likedResponseIds;
  }
}

export const feedDb = new FeedDatabase(); 