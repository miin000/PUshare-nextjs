import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useUpdateProfile } from '@/hooks/useUserMutations';
import { User } from '@/@types/user.type';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải thông tin người dùng...
      </div>
    );
  }

  const [fullName, setFullName] = useState(user.fullName);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const updateMutation = useUpdateProfile();
  

  // Đồng bộ state khi user prop thay đổi
  useEffect(() => {
    setFullName(user.fullName);
    setAvatarUrl(user.avatarUrl || '');
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { fullName, avatarUrl },
      { onSuccess: onClose }
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child as={Fragment} /* ... */>
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              /* ... (Transition panel) ... */
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-xl font-medium text-gray-900">
                  Chỉnh sửa hồ sơ
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Upload Avatar */}
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random`}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      options={{
                        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                        multiple: false,
                        cropping: true,
                        croppingAspectRatio: 1, // ✅ đúng key
                        }}

                      onSuccess={(result) => {
                        if (typeof result.info === 'object' && result.info?.secure_url) {
                          setAvatarUrl(result.info.secure_url);
                        }
                      }}
                    >
                      {({ open }) => (
                        <button type="button" onClick={() => open()} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                          Thay đổi Avatar
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>

                  {/* Sửa Tên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="mt-6 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {updateMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}