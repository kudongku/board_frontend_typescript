'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PostDetailResponseDto } from '@/types/models';
import {
  deleteFile,
  getFile,
  getPostDetail,
  updateFile,
  updatePost,
} from '@/api/post';
import { AxiosError } from 'axios';

interface EditPageProps {
  params: {
    postId: number;
  };
}

function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const { postId } = params;
  const [post, setPost] = useState<PostDetailResponseDto | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postDetailResponseDto = await getPostDetail(postId);
        setPost(postDetailResponseDto);
        setLoading(false);

        if (postDetailResponseDto.hasFile) {
          const fileResponseDto = await getFile(postId);
          setFileUrl(fileResponseDto.fileUrl);
          setFileName(fileResponseDto.fileName);
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(axiosError.response?.data || '에러가 발생했습니다.');
      }
    };

    fetchPosts();
  }, [postId, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    try {
      let uploadedFileId: number | null = null;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('postFile', imageFile);
        uploadedFileId = await updateFile(postId, imageFormData);
      }

      await updatePost(postId, {
        title,
        content,
        fileId: uploadedFileId,
      });

      router.push(`/posts/${postId}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data || '에러가 발생했습니다.');
      router.push(`/posts/${postId}`);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await deleteFile(postId);
      setFileUrl(null);
      setImageFile(null);
      alert('이미지가 삭제되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data || '에러가 발생했습니다.');
      router.push(`/posts/${postId}`);
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시글 수정하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            제목
            <input
              id="title"
              type="text"
              name="title"
              defaultValue={post?.title || ''}
              required
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            내용
            <textarea
              id="content"
              name="content"
              defaultValue={post?.content || ''}
              required
              rows={10}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
        <div>
          {fileUrl && (
            <div>
              <a
                href={fileUrl}
                download={fileName}
                className="text-blue-600 underline"
              >
                {fileName || '파일 다운로드'}
              </a>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
        <div>
          <p>수정을 원하시면 다른 파일을 업로드 해주세요</p>
          <input
            id="file"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          제출
        </button>
      </form>
    </div>
  );
}

export default EditPage;
