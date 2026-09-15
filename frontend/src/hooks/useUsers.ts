import { useState, useCallback } from 'react';
import { User } from '../models';
import { userService, searchService } from '../services';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommended = useCallback(async (currentUserId: string) => {
    setIsLoading(true);
    try {
      const data = await userService.getRecommendedUsers(currentUserId);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recommended users'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const search = useCallback(async (filters: any) => {
    setIsLoading(true);
    try {
      const data = await searchService.search(filters);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search users'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { users, isLoading, error, fetchUsers, getRecommended, search };
};
