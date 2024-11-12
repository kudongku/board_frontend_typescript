"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Navbar: React.FC = ({}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

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
            onClick={handleLogout}
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
};

export default Navbar;
