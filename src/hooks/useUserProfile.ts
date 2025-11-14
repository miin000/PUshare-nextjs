import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from '@/@types/user.type';
import { Document } from '@/@types/document.type';

// --- Kiểu dữ liệu (Tái sử dụng từ các hook khác) ---
interface DocumentsResponse {
  data: Document[];
  pagination: { total: number; /* ... */ };
}
interface UserStats {
  totalUploads: number;
  totalDownloads: number;
  avgDownloadsPerDoc: number;
}

// --- Hook lấy thông tin Profile CÔNG KHAI ---
const getUserProfile = async (userId: string): Promise<User> => {
  // Chúng ta dùng API đã tạo sẵn (nó chỉ trả về thông tin public)
  const response = await api.get(`/users/profile/${userId}`);
  return response.data;
};

export const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId, // Chỉ chạy khi có userId
  });
};

// --- Hook lấy tài liệu CÔNG KHAI của 1 user ---
const getUserDocuments = async (userId: string): Promise<DocumentsResponse> => {
  // Chúng ta cần 1 API mới ở backend, nhưng tạm thời
  // chúng ta sẽ dùng API 'my-uploads' và giả định nó hoạt động
  // (Chúng ta sẽ sửa API backend ở bước sau)
  const response = await api.get(`/documents/user/${userId}/uploads`);
  return response.data;
};

export const useUserDocuments = (userId: string) => {
  return useQuery({
    queryKey: ['userDocuments', userId],
    queryFn: () => getUserDocuments(userId),
    enabled: !!userId, // Chỉ chạy khi có userId
  });
};

// --- Hook lấy Stats CÔNG KHAI của 1 user ---
const getUserStats = async (userId: string): Promise<UserStats> => {
  // Chúng ta cũng cần 1 API mới ở backend
  const response = await api.get(`/users/${userId}/stats`);
  return response.data;
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => getUserStats(userId),
    enabled: !!userId,
  });
};