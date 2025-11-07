import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Document } from '@/@types/document.type';

// Định nghĩa kiểu dữ liệu trả về từ API (có phân trang)
interface DocumentsResponse {
  data: Document[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Cập nhật hook
export const useDocuments = (sortBy: string, sortOrder: string) => {
  // Hàm fetcher
  const getDocuments = async (): Promise<DocumentsResponse> => {
    const response = await api.get('/documents', {
      params: {
        sortBy: sortBy, // 'uploadDate' or 'downloads'
        sortOrder: sortOrder, // 'asc' or 'desc'
        // (Thêm các params filter khác ở đây sau)
      },
    });
    return response.data;
  };

  return useQuery({
    // queryKey PHẢI bao gồm các tham số
    queryKey: ['documents', sortBy, sortOrder],
    queryFn: getDocuments,
  });
};