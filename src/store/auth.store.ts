import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import { User } from '@/@types/user.type';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean; // <-- THÊM MỚI: State theo dõi hydration
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void; // <-- THÊM MỚI
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false, // <-- Giá trị ban đầu

      setHasHydrated: (hasHydrated) => {
        set({ _hasHydrated: hasHydrated });
      },

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', {
            email,
            password,
          });
          const { user, accessToken } = response.data;
          set({ user, token: accessToken, isAuthenticated: true });
          toast.success('Đăng nhập thành công!');
        } catch (error: any) {
          console.error('Login failed:', error);
          toast.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng');
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        toast.success('Đã đăng xuất');
      },
    }),
    {
      name: 'auth-storage',
      // THÊM MỚI: Callback này sẽ chạy SAU KHI khôi phục xong
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);