'use client';

import { useState, useEffect } from 'react';
import { missionariesApiService, Missionary, CreateMissionaryDto, UpdateMissionaryDto } from './missionaries-api';

export interface UseMissionariesResult {
  missionaries: Missionary[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMissionaries(): UseMissionariesResult {
  const [missionaries, setMissionaries] = useState<Missionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissionaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await missionariesApiService.getAllMissionaries();
      setMissionaries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missionaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionaries();
  }, []);

  return {
    missionaries,
    loading,
    error,
    refetch: fetchMissionaries,
  };
}

export interface UseMissionaryResult {
  missionary: Missionary | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMissionary(id: string): UseMissionaryResult {
  const [missionary, setMissionary] = useState<Missionary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissionary = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await missionariesApiService.getMissionaryById(id);
      setMissionary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missionary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionary();
  }, [id]);

  return {
    missionary,
    loading,
    error,
    refetch: fetchMissionary,
  };
}

export interface UseCreateMissionaryResult {
  createMissionary: (data: CreateMissionaryDto) => Promise<Missionary>;
  loading: boolean;
  error: string | null;
}

export function useCreateMissionary(): UseCreateMissionaryResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMissionary = async (data: CreateMissionaryDto): Promise<Missionary> => {
    try {
      setLoading(true);
      setError(null);
      const result = await missionariesApiService.createMissionary(data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create missionary';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createMissionary,
    loading,
    error,
  };
}

export interface UseUpdateMissionaryResult {
  updateMissionary: (id: string, data: UpdateMissionaryDto) => Promise<Missionary>;
  loading: boolean;
  error: string | null;
}

export function useUpdateMissionary(): UseUpdateMissionaryResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMissionary = async (id: string, data: UpdateMissionaryDto): Promise<Missionary> => {
    try {
      setLoading(true);
      setError(null);
      const result = await missionariesApiService.updateMissionary(id, data);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update missionary';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMissionary,
    loading,
    error,
  };
}

export interface UseDeleteMissionaryResult {
  deleteMissionary: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useDeleteMissionary(): UseDeleteMissionaryResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMissionary = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await missionariesApiService.deleteMissionary(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete missionary';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteMissionary,
    loading,
    error,
  };
}
