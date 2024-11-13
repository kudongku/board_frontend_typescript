import { PostListResponseDto } from '@/types/models';
import React from 'react';
import { useRouter } from 'next/navigation';

interface PostThumbnailProps {
  postListResponseDto: PostListResponseDto;
}

function PostThumbnail({ postListResponseDto }: PostThumbnailProps) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/posts/${postListResponseDto.postId}`);
  };

  return (
    <div
      className="p-4 bg-blue-500 text-white"
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
