// src/app/(main)/page.tsx (Frontend)

'use client';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentCard from '@/components/documents/DocumentCard';
import { Squares2X2Icon, QueueListIcon } from '@heroicons/react/24/solid';
// --- THÊM IMPORT MỚI ---
import SortDropdown, {
  SortOption,
} from '@/components/common/SortDropdown';
// --- KẾT THÚC ---

type ViewMode = 'grid' | 'list';

// Định nghĩa các lựa chọn cho dropdown
const sortByOptions: SortOption[] = [
  { label: 'Ngày đăng (Mới nhất)', value: 'uploadDate' },
  { label: 'Lượt tải (Nhiều nhất)', value: 'downloads' },
];

const sortOrderOptions: SortOption[] = [
  { label: 'Giảm dần (Desc)', value: 'desc' },
  { label: 'Tăng dần (Asc)', value: 'asc' },
];

export default function HomePage() {
  // State cho chế độ xem (Grid/List)
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // State cho sắp xếp (Sử dụng object đầy đủ)
  const [sortBy, setSortBy] = useState<SortOption>(sortByOptions[0]);
  const [sortOrder, setSortOrder] = useState<SortOption>(sortOrderOptions[0]);

  // Gọi hook với giá trị .value
  const { data, isLoading, isError } = useDocuments(
    sortBy.value,
    sortOrder.value
  );

  if (isLoading) {
    return (
      <div className="text-gray-800 dark:text-gray-200">Đang tải tài liệu...</div>
    );
  }
  if (isError) {
    return <div className="text-red-600">Lỗi khi tải tài liệu.</div>;
  }

  return (
    <div>
      {/* === THANH HEADER MỚI === */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          All Documents ({data?.pagination.total || 0})
        </h1>

        <div className="flex flex-wrap items-center gap-4">
          {/* --- THAY THẾ NÚT BẰNG DROPDOWN --- */}
          <SortDropdown
            label="Sắp xếp theo"
            options={sortByOptions}
            value={sortBy}
            onChange={setSortBy}
          />
          <SortDropdown
            label="Thứ tự"
            options={sortOrderOptions}
            value={sortOrder}
            onChange={setSortOrder}
          />
          {/* --- KẾT THÚC THAY THẾ --- */}

          {/* Nút Chuyển View (Grid/List) */}
          <div className="flex p-1 bg-gray-200 rounded-lg dark:bg-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${
                viewMode === 'grid' ? 'bg-white shadow dark:bg-gray-900' : ''
              }`}
            >
              <Squares2X2Icon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${
                viewMode === 'list' ? 'bg-white shadow dark:bg-gray-900' : ''
              }`}
            >
              <QueueListIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>
      {/* === KẾT THÚC HEADER MỚI === */}

      {/* Hiển thị danh sách */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {data?.data.map((doc) => (
          <DocumentCard key={doc._id} doc={doc} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}