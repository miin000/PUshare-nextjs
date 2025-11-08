import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

export interface UpdateProfileDto {
  fullName?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

const updateProfile = async (data: UpdateProfileDto) => {
  const res = await api.patch('/users/me/profile', data);
  return res.data;
};

const changePassword = async (data: ChangePasswordDto) => {
  const res = await api.post('/users/me/change-password', data);
  return res.data;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      toast.success('Cập nhật hồ sơ thành công!');
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['myProfile'] });
    },
    onError: (err: any) => toast.error(err.response?.data?.message || 'Lỗi cập nhật.'),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => toast.success('Đổi mật khẩu thành công!'),
    onError: (err: any) => toast.error(err.response?.data?.message || 'Lỗi đổi mật khẩu.'),
  });
};
