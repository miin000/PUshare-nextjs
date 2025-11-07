'use client';
import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import FilterSidebar from '@/components/layout/FilterSidebar';
import AuthGuard from '@/components/auth/AuthGuard';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-1">
          <FilterSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 p-6 relative bg-gray-50 transition-all duration-300">
            {/* Nút mở sidebar khi nó đóng */}
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-800" />
              </button>
            )}
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
