export interface PostListResponseDto {
  postId: number;
  title: string;
  username: string;
  createdAt: string;
}

export interface PostDetailResponseDto {
  title: string;
  content: string;
  username: string;
  createdAt: string;
  hasFile: boolean;
}
