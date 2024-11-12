"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import instance from "@/utils/axios";
import { PostDetailResponseDto } from "@/types/models";
import { getFile, getPostDetail } from "@/api/post";

interface EditPageProps {
  params: {
    postId: number;
  };
}

const EditPage: React.FC<EditPageProps> = ({ params }: EditPageProps) => {
  const router = useRouter();
  const postId: number = params.postId;
  const [post, setPost] = useState<PostDetailResponseDto | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postDetailResponseDto = await getPostDetail(postId);
        setPost(postDetailResponseDto);
        setLoading(false);

        if (postDetailResponseDto.hasFile) {
          const fileResponse = getFile(postId);
          const disposition = fileResponse.headers["content-disposition"];
          const extractedFileName = disposition
            ? disposition.split("filename=")[1]
            : "downloaded_file";

          const fileBlob = fileResponse.data;
          const fileUrl = URL.createObjectURL(fileBlob);
          setFileUrl(fileUrl);
          setFileName(extractedFileName);
        }
      } catch (error: any) {
        if (error.response?.status === 403) {
          alert("권한이 없어 로그인창으로 이동합니다.");
          router.push("/login");
        } else {
          alert(error.response?.data || "에러가 발생했습니다.");
        }
      }
    };

    fetchPosts();
  }, [postId, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      let uploadedFileId: number | null = null;

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("postImage", imageFile);

        const imageResponse = await instance.put<{ fileId: number }>(
          `/posts/${postId}/files`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );

        if (imageResponse.status === 200) {
          uploadedFileId = imageResponse.data.fileId;
        }
      }

      await instance.put(`/posts/${postId}`, {
        title,
        content,
        fileId: uploadedFileId,
      });

      router.push(`/posts/${postId}`);
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("권한이 없어 로그인창으로 이동합니다.");
        router.push("/login");
      } else {
        alert(error.response?.data || "에러가 발생했습니다.");
        router.push(`/posts/${postId}`);
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await instance.delete(`/posts/${postId}/files`);

      if (response.status === 200) {
        setFileUrl(null);
        setImageFile(null);
        alert("이미지가 삭제되었습니다.");
      } else {
        alert("이미지 삭제 중 오류가 발생했습니다.");
      }
    } catch (error: any) {
      alert(error.response?.data || "에러가 발생했습니다.");
    }
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setImageFile(file);
      setFileUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">게시글 수정하기</h1>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div>
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            name="title"
            defaultValue={post?.title || ""}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-gray-700 font-medium mb-2"
          >
            내용
          </label>
          <textarea
            id="content"
            name="content"
            defaultValue={post?.content || ""}
            required
            rows={10}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          {fileUrl && (
            <div>
              <a
                href={fileUrl}
                download={fileName}
                className="text-blue-600 underline"
              >
                {fileName || "파일 다운로드"}
              </a>
              <button
                type="button"
                onClick={handleDeleteImage}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
              >
                삭제하기
              </button>
            </div>
          )}
        </div>
        <div>
          <p>수정을 원하시면 다른 파일을 업로드 해주세요</p>
          <input
            id="file"
            type="file"
            name="file"
            className="w-full p-2 border border-gray-300 rounded-lg"
            onChange={handleImageChange}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
        >
          제출
        </button>
      </form>
    </div>
  );
};

export default EditPage;
