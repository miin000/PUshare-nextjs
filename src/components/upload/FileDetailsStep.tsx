// src/components/upload/FileDetailsStep.tsx
'use client';
import { UploadDocumentDto } from '@/@types/document.type';

interface FileDetailsStepProps {
  files: File[];
  metadata: Partial<UploadDocumentDto>[];
  setMetadata: React.Dispatch<React.SetStateAction<Partial<UploadDocumentDto>[]>>;
  onSubmit: () => void; // Hàm để chuyển sang Bước 3
}

// Dữ liệu giả cho dropdowns (giống FilterSidebar)
const faculties = ['Information Technology', 'Math-IT', 'Applied Science'];
const documentTypes = ['Lecture Notes', 'Exam Paper', 'Solved Exercises'];
const schoolYears = ['2024-2025', '2023-2024', '2022-2023'];

export default function FileDetailsStep({ 
  files, 
  metadata, 
  setMetadata, 
  onSubmit 
}: FileDetailsStepProps) {

  // Hàm cập nhật metadata cho một file cụ thể
  const handleMetadataChange = (
    index: number,
    field: keyof UploadDocumentDto,
    value: string
  ) => {
    const newMetadata = [...metadata];
    newMetadata[index] = {
      ...newMetadata[index],
      [field]: value,
    };
    setMetadata(newMetadata);
  };

  return (
    <div>
      {files.map((file, index) => (
        <div key={index} className="p-4 mb-4 border rounded-lg">
          <h3 className="text-lg font-semibold">{file.name}</h3>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Faculty */}
            <select 
              className="p-2 border rounded"
              onChange={(e) => handleMetadataChange(index, 'faculty', e.target.value)}
            >
              <option value="">-- Môn học (Faculty) --</option>
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>

            {/* Document Type */}
            <select 
              className="p-2 border rounded"
              onChange={(e) => handleMetadataChange(index, 'documentType', e.target.value)}
            >
              <option value="">-- Thể loại (Type) --</option>
              {documentTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* School Year */}
            <select 
              className="p-2 border rounded"
              onChange={(e) => handleMetadataChange(index, 'schoolYear', e.target.value)}
            >
              <option value="">-- Năm học --</option>
              {schoolYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="mt-4">
            <input 
              type="text"
              placeholder="Tiêu đề (Title)"
              className="w-full p-2 border rounded"
              onChange={(e) => handleMetadataChange(index, 'title', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <textarea
              placeholder="Mô tả (Description)"
              className="w-full p-2 border rounded"
              onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button 
        onClick={onSubmit} 
        className="w-full p-3 mt-4 text-white bg-blue-500 rounded-lg"
      >
        Tiếp tục (Next)
      </button>
    </div>
  );
}