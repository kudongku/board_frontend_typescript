import React, {
  useState,
  useEffect,
  FormEvent,
  useCallback,
  useRef,
} from 'react';
import { getComments } from '@/api/post';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import handleError from '@/utils/errorHandler';
import { CommentResponseDto } from '@/api/post/types';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Comment from './Comment';

interface CommentBarProps {
  postId: number;
}

function CommentBar({ postId }: CommentBarProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [content, setContent] = useState<string>('');
  const stompClientRef = useRef<Stomp.Client | null>(null);

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

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No token found!');
      return;
    }

    const socket = new SockJS('http://localhost:8080/stomp/comments');
    const stompClient = Stomp.over(socket);
    stompClientRef.current = stompClient;

    stompClient.connect({ token }, () => {
      console.log('STOMP connected');

      // Post-specific subscription
      stompClient.subscribe(`/sub/posts/${postId}/comments`, message => {
        const newComment: CommentResponseDto = JSON.parse(message.body);
        setComments(prevComments => [newComment, ...prevComments]);
      });
    });

    // eslint-disable-next-line consistent-return
    return () => {
      stompClient.disconnect(() => {
        console.log('STOMP disconnected');
      });
    };
  }, [postId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!content.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No token available');

      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.send(
          `/pub/posts/${postId}/comments`,
          { token },
          JSON.stringify({ content }),
        );
        setContent('');
      } else {
        console.error('STOMP client not connected');
      }
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
