'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import instance from '../utils/axios';
import { PostListResponseDto } from '@/types/models';
import PostThumbnail from '@/components/PostThumbnail';
import Pagination from '@/components/Pagination';

const Home: React.FC = () => {
  const [postList, setPostList] = useState<PostListResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const pagesPerGroup = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await instance.get(
          `/posts?page=${currentPage}&size=${postsPerPage}&sort=createdAt,desc`
        );
        setPostList(response.data.content);
        setTotalPages(response.data.totalPages);
      } catch (error: any) {
        alert(error.response?.data || '페이지 리스트 조회 중 에러 발생.');
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageGroupChange = (direction: number) => {
    const newPageGroup = currentPageGroup + direction;
    if (newPageGroup >= 0 && newPageGroup * pagesPerGroup < totalPages) {
      setCurrentPageGroup(newPageGroup);
      setCurrentPage(Math.max(currentPage, newPageGroup * pagesPerGroup));
    }
  };

  const handlePostsPerPageChange = (num: number) => {
    setPostsPerPage(num);
    setCurrentPage(0);
  };

  return (
    <div>
      <div className="w-full max-w-4xl space-y-4">
        {postList.map((postListResponseDto) => (
          <PostThumbnail
            key={postListResponseDto.postId}
            postListResponseDto={postListResponseDto}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        currentPageGroup={currentPageGroup}
        pagesPerGroup={pagesPerGroup}
        postsPerPage={postsPerPage}
        onPageChange={handlePageChange}
        onPageGroupChange={handlePageGroupChange}
        onPostsPerPageChange={handlePostsPerPageChange}
      />
    </div>
  );
};

export default Home;
