import React from 'react';
import { useRouter } from 'next/navigation';
import { PostDto } from '@/api/post/types';

interface PostThumbnailProps {
  postListResponseDto: PostDto;
}

function PostThumbnail({ postListResponseDto }: PostThumbnailProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/posts/${postListResponseDto.postId}`);
  };

  return (
    <div
      className="p-4 bg-blue-500 text-white rounded-lg"
      onClick={handleClick}
      role="presentation"
    >
      <h2>{postListResponseDto.title}</h2>
      <p>작성자: {postListResponseDto.username}</p>
      <p>
        작성일: {new Date(postListResponseDto.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export default PostThumbnail;
