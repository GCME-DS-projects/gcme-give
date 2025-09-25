import { api } from "@/lib/api";
import { Strategy } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const strategiesQueryKeys = {
  all: ['strategies'] as const,
  lists: () => [...strategiesQueryKeys.all, 'list'] as const,
};


export const useGetStrategies = () => {
  return useQuery({
    queryKey: strategiesQueryKeys.lists(),
    queryFn: () => api.strategies.getStrategies(),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (typeof error === "object" && error !== null && "status" in error) {
        const status = (error as { status?: number }).status;
        return status !== 401 && failureCount < 2;
      }
      return failureCount < 2;
    },
  });
};

export const useGetStrategy = (id: string) => {
  return useQuery({
    queryKey: [...strategiesQueryKeys.all, id],
    queryFn: () => api.strategies.getStrategy(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: unknown) => {
      if (typeof error === "object" && error !== null && "status" in error) {
        const status = (error as { status?: number }).status;
        return status !== 401 && failureCount < 2;
      }
      return failureCount < 2;
    },
  });
};

export const useCreateStrategyMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Strategy>) => api.strategies.createStrategy(data),
    onSuccess: (createdStrategy: Strategy) => {
      // Invalidate and refetch
      queryClient.setQueryData<Strategy[]>(strategiesQueryKeys.lists(), (oldData) => {
        return oldData ? [...oldData, createdStrategy] : [createdStrategy];
      });

      toast.success('Strategy created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error creating strategy');
    },
  });
}

export const useUpdateStrategyMutation = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Strategy>) => api.strategies.updateStrategy(id, data),
    onSuccess: (updatedStrategy: Strategy) => {
      // Update the specific strategy in the cache
      queryClient.setQueryData<Strategy[]>(strategiesQueryKeys.lists(), (oldData) => {
        return oldData ? oldData.map(strategy => strategy.id === id ? updatedStrategy : strategy) : [updatedStrategy];
      });

      // Also update the individual strategy cache if it exists
      queryClient.setQueryData<Strategy>([...strategiesQueryKeys.all, id], updatedStrategy);

      toast.success('Strategy updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error updating strategy');
    },
  });
}

export const useDeleteStrategyMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.strategies.deleteStrategy(id),
    onSuccess: (_data, id: string) => {
      queryClient.setQueryData<Strategy[]>(strategiesQueryKeys.lists(), (oldData) =>
        oldData ? oldData.filter((s) => s.id !== id) : []
      );

      queryClient.removeQueries({ queryKey: [...strategiesQueryKeys.all, id] });

      toast.success("Strategy deleted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting strategy");
    },
  });
};


export const useUploadStrategyImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => api.strategies.uploadImage(file),
    onSuccess: (data) => {
      toast.success('Image uploaded successfully!');
      return data.imageUrl;
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error uploading image');
    },
  });
}