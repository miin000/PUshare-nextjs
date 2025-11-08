import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { UserRole } from '@/@types/user.type';

// Hook chung để refresh danh sách user
const useInvalidateAdminUsers = () => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
  };
};

// --- Hook Cập nhật Vai trò (Thăng/Giáng cấp) ---
const updateUserRole = async ({ userId, role }: { userId: string; role: UserRole }) => {
  return api.patch(`/admin/users/${userId}/role`, { role });
};
export const useUpdateUserRole = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data: any) => {
      const newRole = data.data.role;
      toast.success(`Đã cập nhật vai trò thành ${newRole}!`);
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Cập nhật thất bại'),
  });
};

// --- Hook Block User ---
const blockUser = async (userId: string) => {
  return api.post(`/admin/users/${userId}/block`);
};
export const useBlockUser = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      toast.success('Đã khóa người dùng!');
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Khóa thất bại'),
  });
};

// --- Hook Unblock User ---
const unblockUser = async (userId: string) => {
  return api.post(`/admin/users/${userId}/unblock`);
};
export const useUnblockUser = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      toast.success('Đã mở khóa người dùng!');
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Mở khóa thất bại'),
  });
};

// --- Hook Reset Password ---
const resetPassword = async (userId: string) => {
  const response = await api.post(`/admin/users/${userId}/reset-password`);
  return response.data; // Trả về data (chứa newPassword)
};
export const useResetPassword = () => {
  const invalidate = useInvalidateAdminUsers();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      // Hiển thị mật khẩu mới cho admin
      toast.success(`${data.message}\nMật khẩu mới là: ${data.newPassword}`, {
        duration: 10000, // Hiển thị toast lâu hơn
      });
      invalidate();
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Reset thất bại'),
  });
};