'use client';
import { useEffect, useRef } from 'react'; // <-- Import useRef
import { useUploadDocument } from '@/hooks/useUploadDocument';
import { UploadDocumentDto } from '@/@types/document.type';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface UploadDoneStepProps {
  files: File[];
  metadata: Partial<UploadDocumentDto>[];
}

export default function UploadDoneStep({ files, metadata }: UploadDoneStepProps) {
  const router = useRouter();
  const mutation = useUploadDocument();
  
  // THÊM MỚI: Dùng ref để đảm bảo chỉ chạy 1 lần
  const uploadStartedRef = useRef(false);

  useEffect(() => {
    // Nếu đã chạy rồi, không làm gì cả
    if (uploadStartedRef.current) {
      return;
    }
    // Đánh dấu là đã bắt đầu chạy
    uploadStartedRef.current = true;

    const startUploads = async () => {
      toast.loading(`Đang tải lên ${files.length} tệp...`, { id: 'upload' });

      const uploadPromises = files.map((file, index) => {
        return mutation.mutateAsync({
          file,
          metadata: metadata[index],
        });
      });

      try {
        await Promise.all(uploadPromises);
        toast.success('Tất cả các tệp đã được tải lên!', { id: 'upload' });

        setTimeout(() => {
          // Invalidate query để trang chủ load lại
          // (Chúng ta sẽ thêm cái này sau, giờ cứ redirect)
          router.push('/');
        }, 2000);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi tải lên tệp.', { id: 'upload' });
        // Nếu lỗi, reset lại để user có thể thử lại
        uploadStartedRef.current = false;
      }
    };

    startUploads();
    
    // Xóa dependencies [files, metadata, mutation, router]
    // Bằng cách này, useEffect chỉ chạy MỘT LẦN khi component mount
  }, []); // <-- Mảng dependency rỗng

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold">Đang xử lý...</h2>
      <p>Vui lòng không đóng tab này.</p>
    </div>
  );
}