'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axios';
import { PostDetailResponseDto } from '@/types/models';
import Buttons from '@/components/Buttons';

interface DetailProps {
  params: {
    postId: number;
  };
}

const DetailPost: React.FC<DetailProps> = ({ params }: DetailProps) => {
  const router = useRouter();
  const postId: number = params.postId;
  const [post, setPost] = useState<PostDetailResponseDto | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get<PostDetailResponseDto>(
          `/posts/${postId}`
        );
        setPost(response.data);

        if (response.data.hasFile) {
          const fileResponse = await instance.get<Blob>(
            `/posts/${postId}/files`,
            {
              responseType: 'blob',
            }
          );

          const disposition = fileResponse.headers['content-disposition'];
          const extractedFileName = disposition
            ? disposition.split('filename=')[1]
            : 'downloaded_file';

          const fileBlob = fileResponse.data;
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileUrl(fileUrl);
          setFileName(extractedFileName);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          alert('권한이 없어 로그인창으로 이동합니다.');
          router.push('/login');
        } else {
          console.error('Error fetching posts:', error);
          alert(error.message);
        }
      }
    };

    fetchPosts();
  }, [postId, router]);

  if (!post) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-4">작성자: {post.username}</p>
      <Buttons postId={postId} />
      <div>
        {fileUrl && (
          <a
            href={fileUrl}
            download={fileName || 'downloaded_file'}
            className="text-blue-600 underline"
          >
            {fileName || '파일 다운로드'}
          </a>
        )}
      </div>
      <p className="text-gray-800 mt-4">{post.content}</p>
      <hr className="my-6 border-gray-300" />
      {/* <CommentBar postId={postId} /> */}
    </div>
  );
};

export default DetailPost;
