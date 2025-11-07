'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdminOrMod =
    isAuthenticated && user && ['ADMIN', 'MODERATOR'].includes(user.role);

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md dark:bg-gray-800 dark:border-b dark:border-gray-700">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        Phenikaa Docs
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Search documents by title..."
          className="w-full px-4 py-2 border rounded-full bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <>
            {isAdminOrMod && (
              <Link
                href="/statistics"
                className="px-4 py-2 font-semibold text-gray-700 rounded-full hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Statistics
              </Link>
            )}
            <Link
              href="/upload"
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Upload
            </Link>

            <button
              onClick={logout}
              className="font-semibold text-gray-700 hover:text-blue-500 dark:text-gray-200"
            >
              Đăng xuất
            </button>
            <Link href="/profile/me">
              <span className="flex items-center justify-center w-10 h-10 font-semibold bg-gray-300 rounded-full dark:bg-gray-600 dark:text-gray-100">
                {user?.fullName.charAt(0).toUpperCase() || 'A'}
              </span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600"
            >
              Đăng nhập
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}