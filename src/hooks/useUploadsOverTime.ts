// src/hooks/useUploadsOverTime.ts
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

interface UploadsData {
  date: string; // (Backend trả về "2025-10-01")
  count: number;
}

const getUploadsOverTime = async (): Promise<UploadsData[]> => {
  const response = await api.get('/statistics/uploads-over-time');
  return response.data;
};

export const useUploadsOverTime = () => {
  return useQuery({
    queryKey: ['uploadsOverTime'],
    queryFn: getUploadsOverTime,
  });
};