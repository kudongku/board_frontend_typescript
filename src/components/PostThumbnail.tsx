import { PostListResponseDto } from "@/types/models";
import React from "react";
import { useRouter } from "next/navigation";

interface PostThumbnailProps {
  postListResponseDto: PostListResponseDto;
}

const PostThumbnail: React.FC<PostThumbnailProps> = ({
  postListResponseDto,
}) => {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/posts/${postListResponseDto.postId}`);
  };

  return (
    <div className="p-4 bg-blue-500 text-white" onClick={handleClick}>
      <h2>{postListResponseDto.title}</h2>
      <p>작성자: {postListResponseDto.username}</p>
      <p>
        작성일: {new Date(postListResponseDto.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default PostThumbnail;
