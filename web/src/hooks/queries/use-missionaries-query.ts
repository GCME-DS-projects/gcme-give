'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { missionariesApi } from '@/lib/api/missionaries';
import { Missionary, CreateMissionaryDto, UpdateMissionaryDto, DeleteResponse, QueryMissionaryDto } from '@/lib/types';
import { toast } from 'sonner';

export const missionariesQueryKeys = {
  all: ['missionaries'] as const,
  lists: () => [...missionariesQueryKeys.all, 'list'] as const,
  details: () => [...missionariesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...missionariesQueryKeys.details(), id] as const,
};

// Fetch list with optional query
export const useGetMissionaries = (query?: QueryMissionaryDto) => {
  return useQuery({
    queryKey: [...missionariesQueryKeys.lists(), query ?? {}],
    queryFn: () => missionariesApi.getMissionaries(query),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => error?.status !== 401 && failureCount < 2,
  });
};

// Fetch single missionary
export const useGetMissionary = (id: string) => {
  return useQuery({
    queryKey: missionariesQueryKeys.detail(id),
    queryFn: () => missionariesApi.getMissionary(id),
    staleTime: 5 * 60 * 1000,
  });
};

// Create missionary
export const useCreateMissionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMissionaryDto) => missionariesApi.createMissionary(data),
    onSuccess: (newMissionary) => {
      queryClient.invalidateQueries({ queryKey: missionariesQueryKeys.lists() });
      toast.success('Missionary created successfully!');
    },
    onError: (error: Error) => toast.error(error.message || 'Error creating missionary'),
  });
};

// Update missionary
export const useUpdateMissionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMissionaryDto }) => missionariesApi.updateMissionary(id, data),
    onSuccess: (updatedMissionary) => {
      queryClient.invalidateQueries({ queryKey: missionariesQueryKeys.lists() });

      queryClient.invalidateQueries({ queryKey: missionariesQueryKeys.detail(updatedMissionary.id) });
      toast.success('Missionary updated successfully!');
    },
    onError: (error: Error) => toast.error(error.message || 'Error updating missionary'),
  });
};

// Delete missionary
export const useRemoveMissionary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => missionariesApi.removeMissionary(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: missionariesQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: missionariesQueryKeys.detail(id) });
      toast.success('Missionary deleted successfully!');
    },
    onError: (error: Error) => toast.error(error.message || 'Error deleting missionary'),
  });
};
