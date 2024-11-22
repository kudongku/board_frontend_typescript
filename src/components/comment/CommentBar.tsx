import React, { useState, useEffect, FormEvent, useCallback } from 'react';
import { createComment, getComments } from '@/api/post';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import handleError from '@/utils/errorHandler';
import { CommentResponseDto } from '@/api/post/types';
import Comment from './Comment';

interface CommentBarProps {
  postId: number;
}

function CommentBar({ postId }: CommentBarProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for UX
  const [content, setContent] = useState<string>(''); // Track content for controlled input

  const fetchComments = useCallback(
    async (page: number) => {
      setIsLoading(true);
      try {
        const response = await getComments(postId, page);
        setComments(response.content);
        setHasNext(!response.last);
      } catch (error) {
        handleError(error as AxiosError, router);
      } finally {
        setIsLoading(false);
      }
    },
    [postId, router],
  );

  useEffect(() => {
    fetchComments(currentPage);
  }, [fetchComments, currentPage]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return; // Prevent empty submissions

    try {
      await createComment(postId, { content });
      setContent(''); // Reset content after submission
      setCurrentPage(0); // Reset to the first page
      fetchComments(0); // Fetch the latest comments
    } catch (error) {
      handleError(error as AxiosError, router);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6 pt-20 rounded-lg dark:bg-gray-800">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-4xl">
        <div className="flex items-center space-x-4">
          <input
            id="content"
            type="text"
            name="content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="댓글 입력"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '확인'}
          </button>
        </div>
      </form>

      <div className="w-full max-w-4xl space-y-4 mt-6">
        {comments.map(comment => (
          <Comment
            key={comment.commentId}
            comment={comment}
            postId={postId}
            onUpdate={() => fetchComments(currentPage)}
          />
        ))}
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        {currentPage !== 0 && (
          <button
            type="button"
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            이전
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

export default CommentBar;
