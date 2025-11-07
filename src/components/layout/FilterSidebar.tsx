'use client';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

// Dữ liệu giả
const faculties = [
  'Information Technology',
  'Math-IT',
  'Applied Science',
  'Languages',
];
const subjects = ['Calculus', 'Linear Algebra', 'Software Engineering'];

interface FilterSidebarProps {
  isOpen: boolean;  
  onClose: () => void;
}

export default function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  return (
    <aside
      className={`relative flex-shrink-0 
        // --- SỬA CÁC CLASS SAU ---
        bg-white dark:bg-gray-900 
        border-r dark:border-gray-700
        // --- KẾT THÚC ---
        transition-all duration-300 ${
          isOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden'
        }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-800 dark:text-gray-100" />
        </button>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          FACULTY
        </h4>
        {faculties.map((faculty) => (
          <div key={faculty} className="flex items-center mt-2">
            <input
              type="checkbox"
              id={faculty}
              className="mr-2 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={faculty}
              className="text-gray-700 dark:text-gray-300"
            >
              {faculty}
            </label>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
          SUBJECT
        </h4>
        {subjects.map((subject) => (
          <div key={subject} className="flex items-center mt-2">
            <input
              type="checkbox"
              id={subject}
              className="mr-2 rounded dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={subject}
              className="text-gray-700 dark:text-gray-300"
            >
              {subject}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
}