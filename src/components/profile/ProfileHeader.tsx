// src/components/profile/ProfileHeader.tsx
'use client';
import { useMyProfile } from '@/hooks/useMyProfile';
import { useMyStats } from '@/hooks/useMyStats';
import { User } from '@/@types/user.type';

// Component thẻ stat nhỏ
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
      <div className="text-sm text-gray-500 uppercase">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

export default function ProfileHeader() {
  const { data: user, isLoading: isLoadingProfile } = useMyProfile();
  const { data: stats, isLoading: isLoadingStats } = useMyStats();

  if (isLoadingProfile || isLoadingStats) {
    return <div>Đang tải hồ sơ...</div>;
  }

  if (!user || !stats) {
    return <div>Không tìm thấy thông tin.</div>;
  }

  return (
    <>
      {/* Banner */}
      <div className="p-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg text-white">
        <div className="flex items-center">
          {/* Avatar */}
          <div className="flex items-center justify-center w-24 h-24 text-4xl font-bold bg-white rounded-full text-blue-600">
            {user.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="ml-6">
            <h1 className="text-4xl font-bold">{user.fullName}</h1>
            <p className="text-lg opacity-90">{user.email}</p>
            <p className="mt-2 text-sm opacity-80">
              Joined: {new Date(user.joinedDate).toLocaleDateString()}
            </p>
          </div>
          <button className="px-4 py-2 ml-auto bg-white rounded-full text-blue-600 font-semibold">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Thẻ Stats */}
      <div className="flex gap-6 mt-8">
        <StatCard title="Total Uploads" value={stats.totalUploads} />
        <StatCard title="Total Downloads" value={stats.totalDownloads} />
        <StatCard title="Avg Downloads/Doc" value={stats.avgDownloadsPerDoc} />
      </div>
    </>
  );
}