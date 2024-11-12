export type PostListResponseDto = {
  postId: number;
  title: string;
  username: string;
  createdAt: string;
};

export type PostDetailResponseDto = {
  title: string;
  content: string;
  username: string;
  createdAt: string;
  hasFile: boolean;
};

export type FileResponseDto = {
  fileUrl: string;
  fileName: string;
};

export type PostRequestDto = {
  title: string;
  content: string;
  fileId: number | null;
};

export type CommentRequestDto = {
  content: string;
};
