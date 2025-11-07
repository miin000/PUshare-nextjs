'use client';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/@types/user.type';
import { toast } from 'react-hot-toast';
import { useEffect } from 'react'; // <-- Import useEffect

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  // Vì AuthGuard đã chạy, `user` ở đây chắc chắn là user đã khôi phục
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) {
    // Trường hợp dự phòng nếu user bị null (ví dụ: logout ở tab khác)
    return <div>Đang tải thông tin người dùng...</div>;
  }

  // Kiểm tra vai trò trực tiếp
  const isAllowed = allowedRoles.includes(user.role);

  if (isAllowed) {
    // 1. Vai trò đúng -> Hiển thị trang
    return <>{children}</>;
  } else {
    // 2. Vai trò sai -> Chuyển hướng
    // Dùng useEffect để chuyển hướng một cách an toàn
    useEffect(() => {
      toast.error('Bạn không có quyền truy cập trang này.');
      router.replace('/');
    }, [router]);
    
    return <div>Không có quyền truy cập. Đang chuyển hướng...</div>;
  }
}