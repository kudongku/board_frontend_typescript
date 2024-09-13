'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import instance from '../utils/axios';
import { PostList } from '@/types/models';
import PostThumbnail from '@/components/PostThumbnail';

const Home: React.FC = () => {
  const [postList, setPostList] = useState<PostList | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(
          `/posts?page=${currentPage}&size=${postsPerPage}&sort=createdAt,desc`
        );
        setPostList(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        console.error('axios error :', error);
        alert(error.response?.data || '페이지 리스트 조회 중 에러 발생.');
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);

  return (
    <div>
      {postList ? (
        <div className="w-full max-w-4xl space-y-4">
          {postList.map((postListResponseDto) => (
            <PostThumbnail
              key={postListResponseDto.postId}
              postListResponseDto={postListResponseDto}
            />
          ))}
        </div>
      ) : (
        <p>게시물이 존재하지 않습니다. 게시물을 등록해주세요.</p>
      )}
    </div>
  );
};

export default Home;
