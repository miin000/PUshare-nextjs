import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Document } from '@/@types/document.type';
import qs from 'qs';

interface DocumentsResponse {
  data: Document[];
  pagination: { total: number; page: number; limit: number; totalPages: number; };
}

export const useDocuments = (sortBy: string, sortOrder: string, subjectIds: string[]) => {
  // ✅ key ổn định tuyệt đối
  const keySubjects = useMemo(() => [...subjectIds].sort().join(','), [subjectIds]);

  const getDocuments = async (): Promise<DocumentsResponse> => {
    const cleanSubjects = subjectIds.filter((id) => !!id); // ✅ lọc trước
    console.log('🚀 [API CALL] /documents params:', {
      sortBy, sortOrder, subjects: cleanSubjects
    });
    const response = await api.get('/documents', {
      params: { sortBy, sortOrder, subjects: subjectIds },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'brackets' }), // ✅ dùng brackets thay vì repeat
    });
    return response.data;
  };

  return useQuery({
    queryKey: ['documents', sortBy, sortOrder, keySubjects],
    queryFn: getDocuments,
    // 🛡️ hạn chế refetch “vô tình”
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 15_000,
    gcTime: 5 * 60_000,
  });
};
