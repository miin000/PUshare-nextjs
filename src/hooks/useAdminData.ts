import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { User } from '@/@types/user.type'; // Import User type

// --- Kiểu dữ liệu (Types) ---
export interface Subject {
  _id: string;
  name: string;
  code: string;
  managingFaculty: string;
}
export interface Major {
  _id: string;
  name: string;
  subjects: Subject[];
}

// --- Hook lấy Môn học (Giữ nguyên) ---
const getAdminSubjects = async (): Promise<Subject[]> => {
  const response = await api.get('/admin/subjects');
  return response.data;
};
export const useAdminSubjects = () => {
  return useQuery({ queryKey: ['adminSubjects'], queryFn: getAdminSubjects });
};

// --- Hook lấy Ngành học (Giữ nguyên) ---
const getAdminMajors = async (): Promise<Major[]> => {
  const response = await api.get('/admin/majors');
  return response.data;
};
export const useAdminMajors = () => {
  return useQuery({ queryKey: ['adminMajors'], queryFn: getAdminMajors });
};

// --- HOOK MỚI: Lấy danh sách User (hỗ trợ tìm kiếm) ---
interface AdminUsersResponse {
  data: User[];
  pagination: { total: number; /* ... */ };
}

const getAdminUsers = async (search: string): Promise<AdminUsersResponse> => {
  const response = await api.get('/admin/users', {
    params: {
      search: search, // Gửi query ?search=...
      limit: 100, // Lấy tối đa 100 user
    },
  });
  return response.data;
};

export const useAdminUsers = (search: string) => {
  return useQuery({
    queryKey: ['adminUsers', search], // Query key phụ thuộc vào 'search'
    queryFn: () => getAdminUsers(search),
  });
};