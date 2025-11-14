'use client';
import { useState, useEffect } from 'react';
import { useSearchStore } from '@/store/search.store';
import { useDebounce } from '@/hooks/useDebounce'; // Hook này đã tạo ở lần trước
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function GlobalSearch() {
  // Lấy giá trị toàn cục từ store
  const globalSearch = useSearchStore((state) => state.search);
  const setGlobalSearch = useSearchStore((state) => state.setSearch);

  // State cục bộ (cho người dùng gõ)
  const [localSearch, setLocalSearch] = useState(globalSearch);

  // Trì hoãn (debounce) giá trị cục bộ
  const debouncedSearch = useDebounce(localSearch, 300); // Trễ 300ms

  // Khi giá trị đã trễ thay đổi, cập nhật store toàn cục
  useEffect(() => {
    setGlobalSearch(debouncedSearch);
  }, [debouncedSearch, setGlobalSearch]);

  // Nếu state toàn cục bị xóa (ví dụ: nút "Xóa lọc"), cập nhật state cục bộ
  useEffect(() => {
    if (globalSearch === '') {
      setLocalSearch('');
    }
  }, [globalSearch]);

  return (
    <div className="relative flex-1 max-w-lg mx-4">
      <input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder="Tìm tài liệu theo tiêu đề..."
        className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-full bg-gray-50"
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
}