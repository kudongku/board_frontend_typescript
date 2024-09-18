'use client';

import { FormEvent } from 'react';
import instance from '@/utils/axios';
import Link from 'next/link';

const Login: React.FC = () => {
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await instance.post('/users/login', data);
      const bearerToken = response.data;
      if (bearerToken) {
        localStorage.setItem('bearerToken', bearerToken);
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error('로그인 실패:', error);
      alert(error.response?.data || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6">로그인하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="ID"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
          >
            로그인
          </button>
          <Link
            href="/signup"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            회원가입하러가기
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
