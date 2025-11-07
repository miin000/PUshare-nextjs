// src/app/(main)/statistics/page.tsx
'use client';
import RoleGuard from '@/components/auth/RoleGuard';
import UploadsOverTimeChart from '@/components/statistics/UploadsOverTimeChart';
import { usePlatformStats } from '@/hooks/usePlatformStats';

// Component thẻ stat nhỏ
function StatCard({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-md">
      <div className="text-sm text-gray-500 uppercase">{title}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}

function StatisticsPageContent() {
  const { data: stats, isLoading } = usePlatformStats();

  if (isLoading) return <p>Đang tải thống kê...</p>;
  if (!stats) return <p>Không có dữ liệu.</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Statistics</h1>
      <p className="mt-1 text-gray-600">Platform analytics and insights</p>

      {/* 4 Thẻ Stats */}
      <div className="flex gap-6 mt-8">
        <StatCard title="Total Uploads" value={stats.totalUploads} />
        <StatCard title="Total Downloads" value={stats.totalDownloads} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Avg DL/Doc" value={stats.avgDlPerDoc} />
      </div>

      {/* Biểu đồ */}
      <div className="mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Uploads Over Time</h2>
        <div className="mt-4">
          <UploadsOverTimeChart />
        </div>
      </div>
    </div>
  );
}

// Bọc trang bằng RoleGuard
export default function StatisticsPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'MODERATOR']}>
      <StatisticsPageContent />
    </RoleGuard>
  );
}