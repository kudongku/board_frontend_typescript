'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';
import { getPosts } from '@/api/post';
import handleError from '@/utils/errorHandler';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import PostThumbnail from '@/components/posting/PostThumbnail';
import { PostDto, PostListResponseDto } from '@/api/post/types';

function Home() {
  const router = useRouter();
  const [postList, setPostList] = useState<PostDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [postsPerPage, setPostsPerPage] = useState<number>(10);
  const [currentPageGroup, setCurrentPageGroup] = useState<number>(0);
  const pagesPerGroup = 5;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postListResponseDto: PostListResponseDto = await getPosts(
          currentPage,
          postsPerPage,
        );
        setPostList(postListResponseDto.postList);
        setTotalPages(postListResponseDto.totalPages);
      } catch (error) {
        handleError(error as AxiosError, router);
      }
    };

    fetchPosts();
  }, [currentPage, postsPerPage, router]);

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
        {postList.map(postListResponseDto => (
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
}

export default Home;
