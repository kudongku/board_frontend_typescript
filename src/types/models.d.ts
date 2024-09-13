export interface PostListResponseDto {
  postId: number;
  title: string;
  username: string;
  createdAt: string;
}

export type PostList = PostListResponseDto[];
