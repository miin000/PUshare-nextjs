// src/app/(auth)/login/page.tsx
'use client'; // Đây là trang tương tác (client component)

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Lấy hàm 'login' và 'isAuthenticated' từ store
  const { login, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  // Tự động chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Chuyển về trang chủ
    }
  }, [isAuthenticated, router]);

  return (
    // Đây là UI rất cơ bản, bạn hãy thay bằng Tailwind CSS cho đẹp
    <div>
      <h1>Đăng nhập</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
}