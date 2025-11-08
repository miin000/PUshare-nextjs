import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { UploadDocumentDto } from '@/@types/document.type'; // Dùng lại DTO của trang Upload

// --- Hook cho SỬA (Update) tài liệu ---
const updateDocument = async ({ docId, data }: { docId: string, data: Partial<UploadDocumentDto> }) => {
  const response = await api.patch(`/documents/${docId}`, data);
  return response.data;
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      toast.success('Cập nhật tài liệu thành công!');
      // Tải lại cả 2 danh sách: trang cá nhân và trang chủ
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    },
  });
};

// --- Hook cho XÓA (Delete) tài liệu ---
const deleteDocument = async (docId: string) => {
  const response = await api.delete(`/documents/${docId}`);
  return response.data;
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Đã xóa tài liệu!');
      // Tải lại cả 2 danh sách
      queryClient.invalidateQueries({ queryKey: ['myDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Xóa thất bại');
    },
  });
};