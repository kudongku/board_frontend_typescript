'use client';

import Link from 'next/link';
import { useAuth } from '@/provider/contexts/authContext';

function Navbar() {
  const { isLoggedIn, logoutState } = useAuth();

  return (
    <div className="container mx-auto px-4 py-2 flex justify-start items-center">
      <Link href="/" className="text-xl font-bold hover:text-gray-200 mr-4">
        게시판
      </Link>

      {isLoggedIn ? (
        <div>
          <Link
            href="/posts"
            className="text-xl font-bold hover:text-gray-200 mr-4"
          >
            Posting
          </Link>

          <button
            type="button"
            onClick={logoutState}
            className="text-xl font-bold hover:text-gray-200"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <Link href="/login" className="text-xl font-bold hover:text-gray-200">
          로그인
        </Link>
      )}
    </div>
  );
}

export default Navbar;
