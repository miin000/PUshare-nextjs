// src/app/(main)/page.tsx (Frontend)

'use client';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import DocumentCard from '@/components/documents/DocumentCard';
import { Squares2X2Icon, QueueListIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import SortDropdown, {
  SortOption,
} from '@/components/common/SortDropdown';
import FilterSidebar from '@/components/layout/FilterSidebar';
import { useDebounce } from '@/hooks/useDebounce';

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

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const debouncedSubjectIds = useDebounce(selectedSubjectIds, 300);

  const { data, isLoading, isError } = useDocuments(sortBy.value, sortOrder.value, debouncedSubjectIds);

  if (isLoading) {
    return (
      <div className="text-gray-800 dark:text-gray-200">Đang tải tài liệu...</div>
    );
  }
  if (isError) return <div className="text-red-600">Lỗi khi tải tài liệu.</div>;

  return (
    // Đây là layout 2 cột mới (thay thế cho (main)/layout.tsx)
    <>
      <FilterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedSubjectIds={selectedSubjectIds}
        setSelectedSubjectIds={setSelectedSubjectIds}
      />

      <main className="flex-1 p-6 relative bg-gray-50 transition-all duration-300">
        {/* Nút mở sidebar khi nó đóng */}
        {isLoading && <div className="absolute inset-0 flex items-center justify-center bg-white/60">Đang tải...</div>}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-800" />
          </button>
        )}
        
        {/* Header của Main (Sắp xếp, Grid/List) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            All Documents ({data?.pagination.total || 0})
          </h1>

          <div className="flex flex-wrap items-center gap-4">
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
            <div className="flex p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-white shadow' : ''
                }`}
              >
                <Squares2X2Icon className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-white shadow' : ''
                }`}
              >
                <QueueListIcon className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* Danh sách tài liệu */}
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
          {data?.data.length === 0 && (
            <p className="text-gray-500 col-span-full">
              Không tìm thấy tài liệu nào khớp với bộ lọc.
            </p>
          )}
        </div>
      </main>
    </>
  );
}