'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/api/auth';
import { LoginRequest } from '@/api/auth/types';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { useAuth } from '@/provider/contexts/authContext';

function Login() {
  const router = useRouter();
  const { loginState } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const loginRequest: LoginRequest = { username, password };

    try {
      const loginResponse = await login(loginRequest);
      loginState(loginResponse);
      router.push('/');
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(axiosError.response?.data as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인하기</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="ID"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {error && (
          <div className="text-red-600 dark:text-red-400 text-sm mt-2">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <Link
            href="/signup"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition-colors duration-300"
          >
            회원가입하러가기
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
