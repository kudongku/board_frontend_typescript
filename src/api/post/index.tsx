import instance from '@/utils/axios';
import {
  PostDetailResponseDto,
  FileResponseDto,
  PostRequestDto,
  CommentRequestDto,
  PostListResponseDto,
} from './types';

export const getPosts = async (
  currentPage: number,
  postsPerPage: number,
): Promise<PostListResponseDto> => {
  const response = await instance.get(
    `/posts?page=${currentPage}&size=${postsPerPage}&sort=createdAt,desc`,
  );
  const postListResponseDto: PostListResponseDto = {
    postList: response.data.content,
    totalPages: response.data.totalPages,
  };
  return postListResponseDto;
};

export const getPostDetail = async (
  postId: number,
): Promise<PostDetailResponseDto> => {
  const response = await instance.get(`/posts/${postId}`);
  const postDetailResponse: PostDetailResponseDto = response.data;
  return postDetailResponse;
};

export const createPost = async (postCreateDto: PostRequestDto) => {
  await instance.post('/posts', postCreateDto);
};

export const updatePost = async (
  postId: number,
  postupdateRequestDto: PostRequestDto,
) => {
  await instance.put(`/posts/${postId}`, postupdateRequestDto);
};

export const deletePost = async (postId: number) => {
  await instance.delete(`/posts/${postId}`);
};

export const getFile = async (postId: number): Promise<FileResponseDto> => {
  const fileResponse = await instance.get<Blob>(`/posts/${postId}/files`, {
    responseType: 'blob',
  });
  const disposition = fileResponse.headers['content-disposition'];
  const extractedFileName = disposition
    ? disposition.split('filename=')[1]
    : 'downloaded_file';
  const fileBlob = fileResponse.data;
  const fileUrl = URL.createObjectURL(fileBlob);
  const fileResponseDto: FileResponseDto = {
    fileUrl,
    fileName: extractedFileName,
  };

  return fileResponseDto;
};

export const postFile = async (fileFormData: FormData) => {
  const imageResponse = await instance.post('/posts/files', fileFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return imageResponse.data.fileId;
};

export const updateFile = async (postId: number, imageFormData: FormData) => {
  const imageResponse = await instance.put(
    `/posts/${postId}/files`,
    imageFormData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return imageResponse.data.fileId;
};

export const deleteFile = async (postId: number) => {
  await instance.delete(`/posts/${postId}/files`);
};

export const getComments = async (postId: number, currentPage: number) => {
  const response = await instance.get(
    `/posts/${postId}/comments?page=${currentPage}&size=10&sort=createdAt,desc`,
  );
  return response.data;
};

export const createComment = async (
  postId: number,
  commentRequestDto: CommentRequestDto,
) => {
  await instance.post(`/posts/${postId}/comments`, commentRequestDto);
};

export const updateComment = async (
  postId: number,
  commentId: number,
  editText: string,
) => {
  await instance.put(`/posts/${postId}/comments/${commentId}`, {
    content: editText,
  });
};

export const deleteComment = async (postId: number, commentId: number) => {
  await instance.delete(`/posts/${postId}/comments/${commentId}`);
};
