import instance from "@/utils/axios";
import { PostDetailResponseDto } from "./types";

export const getPostDetail = async (
  postId: number,
): Promise<PostDetailResponseDto> => {
  const response = await instance.get(`/posts/${postId}`);
  const postDetailResponse: PostDetailResponseDto = response.data;
  return postDetailResponse;
};

export const getFile = async (postId: number) => {
  const fileResponse = await instance.get<Blob>(`/posts/${postId}/files`, {
    responseType: "blob",
  });

  return fileResponse;
};
