import { PostDto } from '@/api/post/types';
import PostThumbnail from './PostThumbnail';

interface PostListProps {
  postList: PostDto[];
}

function PostList({ postList }: PostListProps) {
  return (
    <div className="w-full max-w-4xl space-y-4">
      {postList.map(postListResponseDto => (
        <PostThumbnail
          key={postListResponseDto.postId}
          postListResponseDto={postListResponseDto}
        />
      ))}
    </div>
  );
}

export default PostList;
