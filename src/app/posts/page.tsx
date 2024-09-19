'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';

const Posting: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      let uploadedFileId: number | null = null;

      if (file && file.size != 0) {
        const fileFormData = new FormData();
        fileFormData.append('postFile', file);
        const imageResponse = await instance.post(
          '/posts/files',
          fileFormData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        if (imageResponse.status === 200) {
          uploadedFileId = imageResponse.data.fileId;
        }
      }

      const response = await instance.post('/posts', {
        title,
        content,
        fileId: uploadedFileId,
      });

      alert(response.data);
      router.push('/');
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert('권한이 없어 로그인창으로 이동합니다.');
        router.push('/login');
      } else {
        alert(error.response?.data || '에러가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">게시글 작성하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="제목"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <textarea
            id="content"
            name="content"
            placeholder="글 내용"
            required
            rows={10}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            id="file"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Submitting...' : '제출'}
        </button>
      </form>
    </div>
  );
};

export default Posting;
