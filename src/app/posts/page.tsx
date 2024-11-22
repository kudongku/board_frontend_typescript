'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, postFile } from '@/api/post';
import handleError from '@/utils/errorHandler';
import { AxiosError } from 'axios';

function Posting() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      let uploadedFileId: number | null = null;

      if (file && file.size !== 0) {
        const fileFormData = new FormData();
        fileFormData.append('postFile', file);
        uploadedFileId = await postFile(fileFormData);
      }

      await createPost({
        title,
        content,
        fileId: uploadedFileId,
      });

      router.push('/');
    } catch (error) {
      handleError(error as AxiosError, router);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        게시글 작성하기
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="제목"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <textarea
            id="content"
            name="content"
            placeholder="글 내용"
            required
            rows={10}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <input
            id="file"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Submitting...' : '제출'}
        </button>
      </form>
    </div>
  );
}

export default Posting;
