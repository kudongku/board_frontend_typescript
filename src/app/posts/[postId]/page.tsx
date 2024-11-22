'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Buttons from '@/components/Buttons';
import CommentBar from '@/components/comment/CommentBar';
import { getFile, getPostDetail } from '@/api/post';
import { FileResponseDto, PostDetailResponseDto } from '@/api/post/types';
import handleError from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { useAuth } from '@/provider/contexts/authContext';

interface DetailProps {
  params: {
    postId: number;
  };
}

function DetailPost({ params }: DetailProps) {
  const router = useRouter();
  const { currentUsername } = useAuth();
  const { postId } = params;
  const [post, setPost] = useState<PostDetailResponseDto | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postDetailResponseDto: PostDetailResponseDto =
          await getPostDetail(postId);
        setPost(postDetailResponseDto);

        if (postDetailResponseDto.hasFile) {
          const fileResponseDto: FileResponseDto = await getFile(postId);
          setFileUrl(fileResponseDto.fileUrl);
          setFileName(fileResponseDto.fileName);
        }
      } catch (error) {
        handleError(error as AxiosError, router);
      }
    };

    fetchPosts();
  }, [postId, router]);

  if (!post) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-300">Loading...</p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>
      <p className="text-gray-700 mb-4 dark:text-gray-300">
        작성자: {post.username}
      </p>
      {currentUsername === post.username && <Buttons postId={postId} />}
      <div>
        {fileUrl && (
          <a
            href={fileUrl}
            download={fileName || 'downloaded_file'}
            className="text-blue-600 underline dark:text-blue-400"
          >
            {fileName || '파일 다운로드'}
          </a>
        )}
      </div>
      <p className="text-gray-800 mt-4 dark:text-gray-100">{post.content}</p>
      <hr className="my-6 border-gray-300 dark:border-gray-700" />
      <CommentBar postId={postId} />
    </div>
  );
}

export default DetailPost;
