// src/app/(main)/profile/me/page.tsx
'use client';
import ProfileHeader from "@/components/profile/ProfileHeader";
import { useMyDocuments } from "@/hooks/useMyDocuments";
import MyDocumentListItem from "@/components/profile/MyDocumentListItem";

export default function MyProfilePage() {
  const { data: docData, isLoading, isError } = useMyDocuments();

  return (
    <div className="max-w-6xl mx-auto">
      {/* 1. Header và Stats */}
      <ProfileHeader />

      {/* 2. Danh sách "My Documents" */}
      <div className="mt-12 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">My Documents</h2>
          <span className="font-semibold text-blue-600">
            {docData?.pagination.total || 0} documents
          </span>
        </div>
        
        {/* Nội dung danh sách */}
        <div>
          {isLoading && <p className="p-6">Đang tải tài liệu của bạn...</p>}
          {isError && <p className="p-6 text-red-500">Lỗi khi tải tài liệu.</p>}
          
          {docData && docData.data.length > 0 ? (
            docData.data.map((doc) => (
              <MyDocumentListItem key={doc._id} doc={doc} />
            ))
          ) : (
            !isLoading && <p className="p-6">Bạn chưa tải lên tài liệu nào.</p>
          )}
        </div>
      </div>
    </div>
  );
}