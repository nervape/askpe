'use client';

import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SharedResponse, FeedEvent, SharedResponseInput, LikeInput } from './types';

// Generate a unique user ID for this client (stored in localStorage)
function getUserId(): string {
  if (typeof window === 'undefined') return 'server';
  
  let userId = localStorage.getItem('ape_oracle_user_id');
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('ape_oracle_user_id', userId);
  }
  return userId;
}

// Get user liked response IDs from localStorage
function getUserLikedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  
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
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('ape_oracle_user_liked_ids', JSON.stringify(Array.from(likedIds)));
  } catch (e) {
    console.error('Error saving liked IDs to localStorage:', e);
  }
}

// Socket.io connection
let socket: Socket | null = null;

// Interface for additional event types
interface CustomEvent {
  type: string;
  data: {
    responseId: string;
    likeCount: number;
  };
  timestamp: number;
}

export function useSocketFeed() {
  const [responses, setResponses] = useState<SharedResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const userId = typeof window !== 'undefined' ? getUserId() : 'server';
  // Track responses liked by the current user
  const [likedResponseIds, setLikedResponseIds] = useState<Set<string>>(getUserLikedIds());
  
  // Function to fetch all responses
  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/feed');
      if (!res.ok) throw new Error('Failed to fetch responses');
      const data = await res.json();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Function to share a response
  const shareResponse = useCallback(async (input: Omit<SharedResponseInput, 'userId'>) => {
    try {
      const res = await fetch('/api/feed/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...input,
          userId,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to share response');
      
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error sharing response:', error);
      throw error;
    }
  }, [userId]);
  
  // Function to like/unlike a response
  const toggleLike = useCallback(async (responseId: string) => {
    try {
      const res = await fetch('/api/feed/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responseId,
          userId,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update like');
      
      const data = await res.json();
      
      // Update local liked state based on server response
      setLikedResponseIds(prev => {
        const newSet = new Set(prev);
        if (data.liked) {
          newSet.add(responseId);
        } else {
          newSet.delete(responseId);
        }
        
        // Save to localStorage
        saveUserLikedIds(newSet);
        
        return newSet;
      });
      
      return data;
    } catch (error) {
      console.error('Error updating like:', error);
      throw error;
    }
  }, [userId]);
  
  // Function to check if user liked a specific response
  const hasUserLiked = useCallback((responseId: string) => {
    return likedResponseIds.has(responseId);
  }, [likedResponseIds]);
  
  // Connect to WebSocket and set up event listeners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial data fetch
    fetchResponses();
    
    // Initialize Socket.io connection if not already connected
    if (!socket) {
      // First initialize the server by making a request to the API route
      fetch('/api/socket').then(() => {
        // Connect to WebSocket server
        socket = io('http://localhost:3001');
        
        socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          setConnected(true);
        });
        
        socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          setConnected(false);
        });
        
        socket.on('feed-event', (event: FeedEvent | CustomEvent) => {
          console.log('Received feed event:', event);
          // Update responses based on event type
          setResponses(prev => {
            switch (event.type) {
              case 'new-response':
                // Check if response already exists
                if (prev.some(r => r.id === (event as FeedEvent).data.id)) {
                  return prev;
                }
                return [(event as FeedEvent).data, ...prev];
              
              case 'like':
              case 'unlike':
                // Only update the like count for the response
                // The like button state is managed separately based on local user actions
                return prev.map(r => 
                  r.id === (event as FeedEvent).data.id 
                    ? { ...r, likeCount: (event as FeedEvent).data.likeCount } 
                    : r
                );
              
              case 'like-update':
                // Custom event for like updates
                const customEvent = event as CustomEvent;
                return prev.map(r => 
                  r.id === customEvent.data.responseId 
                    ? { ...r, likeCount: customEvent.data.likeCount } 
                    : r
                );
              
              default:
                return prev;
            }
          });
        });
      }).catch(err => {
        console.error('Failed to initialize WebSocket:', err);
      });
    }
    
    // Cleanup function
    return () => {
      // We don't disconnect the socket on component unmount
      // because we want to keep the connection alive for the entire session
    };
  }, [fetchResponses]);
  
  return {
    responses,
    loading,
    connected,
    fetchResponses,
    shareResponse,
    toggleLike,
    hasUserLiked,
    userId,
  };
} 