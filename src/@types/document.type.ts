// src/@types/document.type.ts
export interface Uploader {
  _id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Document {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploader: Uploader;
  status: 'PROCESSING' | 'VISIBLE' | 'BLOCKED';
  faculty: string;
  subject: string;
  documentType: string;
  schoolYear: string;
  downloadCount: number;
  viewCount: number;
  uploadDate: string; // (Date sẽ được trả về dưới dạng string)
}

export interface UploadDocumentDto {
  title: string;
  description: string;
  faculty: string;
  subject: string;
  documentType: string;
  schoolYear: string;
}