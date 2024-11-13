import React, { useState } from 'react';
import { deleteComment, updateComment } from '@/api/post';
import handleError from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { CommentResponseDto } from '@/api/post/types';
import { useAuth } from '@/provider/contexts/authContext';

interface CommentProps {
  comment: CommentResponseDto;
  postId: number;
  onUpdate: () => Promise<void>;
}

function Comment({ comment, postId, onUpdate }: CommentProps) {
  const router = useRouter();
  const { currentUsername } = useAuth();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(comment.content);

  const handleEditSubmit = async () => {
    try {
      await updateComment(postId, comment.commentId, editText);
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      handleError(error as AxiosError, router);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteComment(postId, comment.commentId);
      onUpdate();
    } catch (error) {
      handleError(error as AxiosError, router);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-lg">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleEditSubmit}
            className="px-3 py-1.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-300"
          >
            수정 완료
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-black-700">
              {comment.content}
            </div>
            {currentUsername === comment.writerUsername && (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-2 py-1 bg-blue-300 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                  ✍️
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  className="px-2 py-1 bg-red-300 text-white font-semibold rounded-lg hover:bg-red-600 transition duration-300"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
          <div className="mt-1 text-sm text-gray-500">
            {comment.writerUsername}
          </div>
        </>
      )}
    </div>
  );
}

export default Comment;
