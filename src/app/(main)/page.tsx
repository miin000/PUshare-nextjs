'use client';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentCard from '@/components/documents/DocumentCard';
import {
  Squares2X2Icon,
  QueueListIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';

type ViewMode = 'grid' | 'list';
type SortBy = 'uploadDate' | 'downloads';
type SortOrder = 'asc' | 'desc';

export default function HomePage() {
  // State cho chế độ xem (Grid/List)
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // State cho sắp xếp
  const [sortBy, setSortBy] = useState<SortBy>('uploadDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Gọi hook với state
  const { data, isLoading, isError } = useDocuments(sortBy, sortOrder);

  // Hàm xử lý thay đổi sắp xếp
  const handleSortChange = (newSortBy: SortBy) => {
    if (newSortBy === sortBy) {
      // Nếu click vào cái đang active, đổi chiều
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Nếu click vào cái mới, set và mặc định là 'desc'
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Documents ({data?.pagination.total || 0})
        </h1>

        <div className="flex items-center gap-4">
          {/* Nút Sắp xếp */}
          <div className="flex gap-2">
            <SortButton
              label="Upload Date"
              isActive={sortBy === 'uploadDate'}
              sortOrder={sortOrder}
              onClick={() => handleSortChange('uploadDate')}
            />
            <SortButton
              label="Downloads"
              isActive={sortBy === 'downloads'}
              sortOrder={sortOrder}
              onClick={() => handleSortChange('downloads')}
            />
          </div>

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
            : 'flex flex-col gap-4' // Container cho List View
        }
      >
        {data?.data.map((doc) => (
          <DocumentCard key={doc._id} doc={doc} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
}

// Component nút Sắp xếp
const SortButton = ({ label, isActive, sortOrder, onClick }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg ${
      isActive
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    }`}
  >
    {label}
    {isActive &&
      (sortOrder === 'desc' ? (
        <ChevronDownIcon className="w-4 h-4" />
      ) : (
        <ChevronUpIcon className="w-4 h-4" />
      ))}
  </button>
);