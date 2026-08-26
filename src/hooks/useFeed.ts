import { useState, useEffect, useCallback } from 'react';
import { feedService } from '../services';
import { Status, StatusComment } from '../models';
import { useAuth } from './useAuth';
import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

export const useFeed = (userId?: string) => {
  const { user } = useAuth();
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadStatuses = useCallback(async () => {
    setIsLoading(true);
    const data = await feedService.getStatuses(userId);
    setStatuses(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const uploadMedia = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id || 'guest'}/${uuidv4()}_${fileName}`;

    const { error } = await supabase.storage
      .from('status_media')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading media:', error);
      throw new Error(`Lỗi upload ảnh/video: ${error.message}`);
    }

    const { data } = supabase.storage.from('status_media').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const createStatus = async (content: string, files: File[]) => {
    if (!user) return null;
    setIsUploading(true);

    const mediaUrls: string[] = [];
    for (const file of files) {
      const url = await uploadMedia(file);
      if (url) mediaUrls.push(url);
    }

    try {
      const newStatus = await feedService.createStatus(user.id, content, mediaUrls);
      
      if (newStatus) {
        setStatuses(prev => [newStatus, ...prev]);
      }
      
      setIsUploading(false);
      return newStatus;
    } catch (error: any) {
      setIsUploading(false);
      throw error;
    }
  };

  const toggleLike = async (statusId: string) => {
    if (!user) return;
    
    const status = statuses.find(s => s.id === statusId);
    if (!status) return;

    // Optimistic UI update
    const isLiked = status.hasLiked;
    setStatuses(prev => prev.map(s => {
      if (s.id === statusId) {
        return {
          ...s,
          hasLiked: !isLiked,
          likesCount: isLiked ? s.likesCount - 1 : s.likesCount + 1
        };
      }
      return s;
    }));

    // Real API call
    const success = await feedService.toggleLike(statusId, user.id, isLiked || false);
    
    // Revert if failed
    if (!success) {
      setStatuses(prev => prev.map(s => {
        if (s.id === statusId) {
          return {
            ...s,
            hasLiked: isLiked,
            likesCount: isLiked ? s.likesCount + 1 : s.likesCount - 1
          };
        }
        return s;
      }));
    }
  };

  const getComments = async (statusId: string) => {
    return await feedService.getComments(statusId);
  };

  const addComment = async (statusId: string, content: string) => {
    if (!user) return null;
    
    const comment = await feedService.addComment(statusId, user.id, content);
    
    if (comment) {
      setStatuses(prev => prev.map(s => {
        if (s.id === statusId) {
          return { ...s, commentsCount: s.commentsCount + 1 };
        }
        return s;
      }));
    }
    
    return comment;
  };

  return {
    statuses,
    isLoading,
    isUploading,
    loadStatuses,
    createStatus,
    toggleLike,
    getComments,
    addComment
  };
};
