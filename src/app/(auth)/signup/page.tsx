'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/api/auth';
import handleError from '@/utils/errorHandler';
import { AxiosError } from 'axios';

function Signup() {
  const router = useRouter();

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signup({
        username: data.username as string,
        password: data.password as string,
        passwordConfirm: data.passwordConfirm as string,
      });
      router.push(`/login`);
    } catch (error) {
      handleError(error as AxiosError, router);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        회원가입하기
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="ID"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="password"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <input
            id="passwordConfirm"
            type="password"
            name="passwordConfirm"
            placeholder="passwordConfirm"
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default Signup;
