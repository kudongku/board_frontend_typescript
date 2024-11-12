import React, { useState, useEffect, FormEvent } from "react";
import instance from "@/utils/axios";
import { useRouter } from "next/navigation";
import Comment from "./Comment";
import { CommentResponseDto } from "@/types/models";
import { createComment, getComments } from "@/api/post";

interface CommentBarProps {
  postId: number;
}

const CommentBar: React.FC<CommentBarProps> = ({ postId }: CommentBarProps) => {
  const router = useRouter();
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getComments(postId, currentPage);
        setComments(response.content);
        setHasNext(!response.last);
      } catch (error: any) {
        if (error.response?.status === 403) {
          alert("권한이 없어 로그인창으로 이동합니다.");
          router.push("/login");
        } else {
          alert(error.response?.data || "Error fetching comments");
        }
      }
    };

    fetchPosts();
  }, [postId, currentPage, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await createComment(postId, {
        content: data.content as string,
      });
      setTimeout(() => window.location.reload(), 0);
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("권한이 없어 로그인창으로 이동합니다.");
        router.push("/login");
      } else {
        alert(error.response?.data || "Error submitting comment");
      }
    }

    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6 pt-20 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div className="flex items-center space-x-4">
          <input
            id="content"
            type="text"
            name="content"
            placeholder="댓글 입력"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            확인
          </button>
        </div>
      </form>

      <div className="w-full max-w-4xl space-y-4 mt-6">
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            comment={comment}
            postId={postId}
            onUpdate={async () => {
              const response = await getComments(postId, currentPage);
              setComments(response.content);
            }}
          />
        ))}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {currentPage !== 0 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            이전
          </button>
        )}

        {hasNext && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentBar;
