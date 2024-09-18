import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentPageGroup: number;
  pagesPerGroup: number;
  postsPerPage: number;
  onPageChange: (page: number) => void;
  onPageGroupChange: (direction: number) => void;
  onPostsPerPageChange: (num: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  currentPageGroup,
  pagesPerGroup,
  postsPerPage,
  onPageChange,
  onPageGroupChange,
  onPostsPerPageChange,
}) => {
  const getPaginationRange = () => {
    const startPage = currentPageGroup * pagesPerGroup;
    const endPage = Math.min(startPage + pagesPerGroup, totalPages);
    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mt-6 space-y-2">
      <div className="mb-4">
        <label htmlFor="postsPerPage" className="mr-2 text-gray-700">
          페이지당 게시물 수:
        </label>
        <select
          id="postsPerPage"
          value={postsPerPage}
          onChange={(e) => onPostsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border rounded"
        >
          {[5, 10, 20, 30].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-center space-x-2">
        {currentPageGroup > 0 && (
          <button
            onClick={() => onPageGroupChange(-1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            이전
          </button>
        )}

        {getPaginationRange().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page
                ? 'bg-blue-700 text-white'
                : 'bg-blue-200 text-gray-700 hover:bg-blue-400'
            }`}
          >
            {page + 1}
          </button>
        ))}

        {(currentPageGroup + 1) * pagesPerGroup < totalPages && (
          <button
            onClick={() => onPageGroupChange(1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
