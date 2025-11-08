'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';
// --- IMPORT MỚI ---
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline';
// --- KẾT THÚC ---

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const isModeratorOrAdmin =
    isAuthenticated && user && ['ADMIN', 'MODERATOR'].includes(user.role);

  // Lấy chữ cái đầu (VD: Phạm Quang Minh -> PM)
  const getAvatarFallback = () => {
    if (!user) return '...';
    const names = user.fullName.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md border-b border-gray-200">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Phenikaa Docs
      </Link>

      <div className="flex-1 max-w-md mx-4">
        {/* ... (Search bar giữ nguyên) ... */}
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && user ? (
          <>
            {/* ... (Các nút Quản lý, Statistics giữ nguyên) ... */}
             {isModeratorOrAdmin && (
              <Link href="/admin/manage" className="px-4 py-2 font-semibold text-gray-700 rounded-full hover:bg-gray-100">
                Quản lý
              </Link>
            )}
            {isModeratorOrAdmin && (
              <Link href="/statistics" className="px-4 py-2 font-semibold text-gray-700 rounded-full hover:bg-gray-100">
                Statistics
              </Link>
            )}
            <Link href="/upload" className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600">
              Upload
            </Link>
            
            {/* --- XÓA NÚT ĐĂNG XUẤT CŨ --- */}
            {/* <button onClick={logout} ... /> */}

            {/* --- THÊM MENU AVATAR MỚI --- */}
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex items-center justify-center w-10 h-10 font-semibold bg-gray-300 rounded-full text-gray-700">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    getAvatarFallback()
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 w-64 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Thông tin User */}
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.fullName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    {/* Nút Profile */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/profile/me"
                          className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                        >
                          <UserIcon className="w-5 h-5 mr-3" />
                          Hồ sơ cá nhân
                        </Link>
                      )}
                    </Menu.Item>
                    {/* Nút Đăng xuất */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`${active ? 'bg-gray-100' : ''} group flex items-center w-full px-4 py-2 text-sm text-red-600`}
                        >
                          <ArrowLeftEndOnRectangleIcon className="w-5 h-5 mr-3" />
                          Đăng xuất
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* --- KẾT THÚC MENU MỚI --- */}

          </>
        ) : (
          <Link href="/login" className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600">
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}