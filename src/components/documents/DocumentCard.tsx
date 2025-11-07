'use client';
import { Document } from '@/@types/document.type';
import { Menu, Transition } from '@headlessui/react';
import {
  EllipsisVerticalIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  FlagIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import api from '@/lib/axios'; // Axios instance đã có token
import { toast } from 'react-hot-toast'; // Thư viện thông báo

interface DocumentCardProps {
  doc: Document;
  viewMode: 'grid' | 'list';
}

// Hàm format số (156 -> 156, 1500 -> 1.5K)
const formatDownloads = (num: number) => {
  if (!num) return 0;
  if (num < 1000) return num;
  return (num / 1000).toFixed(1) + 'K';
};
// Hàm format tên file
const formatFileType = (mimeType: string) => {
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('document')) return 'DOCX';
  if (mimeType.includes('presentation')) return 'PPTX';
  if (mimeType.includes('image')) return 'IMG';
  return 'FILE';
};

export default function DocumentCard({ doc, viewMode }: DocumentCardProps) {
  // --- CÁC HÀM XỬ LÝ SỰ KIỆN ---

  // 1. Chức năng PREVIEW (Cập nhật)
  const handlePreview = () => {
    toast('Tính năng Preview (Xem trước) đang được phát triển!', {
      icon: '🚧',
    });
  };

  // 2. Chức năng SHARE (Giữ nguyên)
  const handleShare = () => {
    const publicUrl = `${window.location.origin}/document/${doc._id}`;
    const textArea = document.createElement('textarea');
    textArea.value = publicUrl;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      toast.success('Đã sao chép đường dẫn thành công!');
    } catch (err) {
      toast.error('Không thể sao chép đường dẫn.');
    }
    document.body.removeChild(textArea);
  };

  // 3. Chức năng DOWNLOAD (Giữ nguyên, lỗi là do CORS)
  const handleDownload = async () => {
    const downloadToastId = toast.loading('Đang tải xuống...');
    try {
      const response = await api.get(`/documents/${doc._id}/download`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      let filename = doc.title;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Tải xuống thành công!', { id: downloadToastId });
    } catch (err) {
      console.error(err);
      toast.error('Tải xuống thất bại.', { id: downloadToastId });
    }
  };

  // 4. Chức năng REPORT (Mới)
  const handleReport = () => {
    toast('Tính năng Report (Báo cáo) đang được phát triển!', {
      icon: '🚧',
    });
  };

  // --- KẾT THÚC CÁC HÀM XỬ LÝ ---

  if (viewMode === 'list') {
    return (
      <ListLayout
        doc={doc}
        onPreview={handlePreview}
        onShare={handleShare}
        onDownload={handleDownload}
        onReport={handleReport}
      />
    );
  }
  return (
    <GridLayout
      doc={doc}
      onPreview={handlePreview}
      onShare={handleShare}
      onDownload={handleDownload}
      onReport={handleReport}
    />
  );
}

// Interface mới: Thêm các hàm onClick
interface LayoutProps {
  doc: Document;
  onPreview: () => void;
  onShare: () => void;
  onDownload: () => void;
  onReport: () => void; // Thêm onReport
}

/**
 * Layout dạng Ô (Grid View)
 */
const GridLayout = ({
  doc,
  onPreview,
  onShare,
  onDownload,
  onReport,
}: LayoutProps) => (
  <div className="relative p-4 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <div className="h-32 flex items-center justify-center bg-blue-50 rounded-lg dark:bg-blue-900/50">
      <span className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-blue-800 uppercase bg-blue-100 rounded dark:bg-blue-700 dark:text-blue-100">
        {formatFileType(doc.fileType)}
      </span>
      <DocumentIcon className="w-12 h-12 text-blue-500 dark:text-blue-300" />
    </div>
    <div className="absolute top-4 right-4">
      <DocumentMenu
        onPreview={onPreview}
        onShare={onShare}
        onDownload={onDownload}
        onReport={onReport}
      />
    </div>
    <h3 className="mt-4 text-lg font-semibold truncate text-gray-900 dark:text-white">
      {doc.title}
    </h3>
    <p className="h-10 mt-1 text-sm text-gray-600 overflow-hidden text-ellipsis dark:text-gray-300">
      {doc.description}
    </p>
    <div className="flex gap-2 mt-3">
      <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
        {doc.subject || 'General'}
      </span>
      <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200">
        {doc.documentType || 'File'}
      </span>
    </div>
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center justify-center w-6 h-6 mr-2 text-xs font-semibold bg-green-200 rounded-full text-green-700">
          {doc.uploader.fullName.substring(0, 2).toUpperCase()}
        </span>
        <span>{doc.uploader.fullName}</span>
      </div>
      <span className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
        <ArrowDownTrayIcon className="inline w-4 h-4 mr-1" />
        {formatDownloads(doc.downloadCount)}
      </span>
    </div>
  </div>
);

/**
 * Layout dạng Hàng (List View)
 */
const ListLayout = ({
  doc,
  onPreview,
  onShare,
  onDownload,
  onReport,
}: LayoutProps) => (
  <div className="relative flex items-center w-full p-4 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
    <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-lg dark:bg-blue-900/50">
      <DocumentIcon className="w-8 h-8 text-blue-500 dark:text-blue-300" />
    </div>
    <div className="flex-1 mx-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {doc.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">
        {doc.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-200">
          {doc.subject || 'General'}
        </span>
        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-200">
          {doc.documentType || 'File'}
        </span>
        <span className="flex items-center">
          <span className="flex items-center justify-center w-5 h-5 mr-1 text-xs font-semibold bg-green-200 rounded-full text-green-700">
            {doc.uploader.fullName.substring(0, 2).toUpperCase()}
          </span>
          {doc.uploader.fullName}
        </span>
        <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
        <span>{formatDownloads(doc.downloadCount)} DLs</span>
        <span>{formatFileType(doc.fileType)}</span>
        <span>{(doc.fileSize / 1024 / 1024).toFixed(1)} MB</span>
      </div>
    </div>
    <div className="absolute top-4 right-4">
      <DocumentMenu
        onPreview={onPreview}
        onShare={onShare}
        onDownload={onDownload}
        onReport={onReport}
      />
    </div>
  </div>
);

/**
 * Component Menu Dropdown
 */
const DocumentMenu = ({
  onPreview,
  onShare,
  onDownload,
  onReport,
}: Omit<LayoutProps, 'doc'>) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
        <EllipsisVerticalIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onPreview}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <EyeIcon className="w-5 h-5 mr-3" />
                  Preview
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onDownload}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <ArrowDownTrayIcon className="w-5 h-5 mr-3" />
                  Download
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onShare}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <ShareIcon className="w-5 h-5 mr-3" />
                  Share
                </button>
              )}
            </Menu.Item>
            <div className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onReport} // Gắn hàm onReport vào đây
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                >
                  <FlagIcon className="w-5 h-5 mr-3" />
                  Report
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};