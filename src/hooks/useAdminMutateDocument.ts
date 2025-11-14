import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';

// Hook chung để refresh danh sách tài liệu admin
const useInvalidateAdminDocs = () => {
  const queryClient = useQueryClient();
  return () => {
    // Tải lại cả 2: danh sách admin và danh sách public
    queryClient.invalidateQueries({ queryKey: ['adminDocuments'] });
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };
};

// --- Hook Block Document ---
const blockDocument = async (docId: string) => {
  return api.post(`/admin/documents/${docId}/block`);
};
export const useBlockDocument = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: blockDocument,
    onSuccess: () => {
      toast.success('Đã block tài liệu!');
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Block thất bại'),
  });
};

// --- Hook Unblock Document ---
const unblockDocument = async (docId: string) => {
  return api.post(`/admin/documents/${docId}/unblock`);
};
export const useUnblockDocument = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: unblockDocument,
    onSuccess: () => {
      toast.success('Đã unblock tài liệu!');
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Unblock thất bại'),
  });
};

// --- Hook Delete Document (Admin) ---
const deleteDocument = async (docId: string) => {
  return api.delete(`/admin/documents/${docId}`);
};
export const useDeleteDocumentAdmin = () => {
  const invalidate = useInvalidateAdminDocs();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      toast.success('Đã xóa vĩnh viễn tài liệu!');
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Xóa thất bại'),
  });
};