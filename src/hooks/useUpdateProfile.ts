import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { UpdateProfileDto } from '@/@types/user.type';
import { ChangePasswordDto } from '@/@types/user.type';
import { useAuthStore } from '@/store/auth.store';

// --- Hook Cập nhật Profile (Tên, Avatar) ---
const updateProfile = async (data: UpdateProfileDto) => {
  const response = await api.patch('/users/me/profile', data);
  return response.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser); // Lấy hàm setUser từ store

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success('Cập nhật thông tin thành công!');
      // Cập nhật state chung của Zustand
      setUser(updatedUser);
      // Tải lại dữ liệu trang profile
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Cập nhật thất bại'),
  });
};

// --- Hook Đổi Mật khẩu ---
const changePassword = async (data: ChangePasswordDto) => {
  const response = await api.post('/users/me/change-password', data);
  return response.data;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Đổi mật khẩu thành công!');
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại'),
  });
};