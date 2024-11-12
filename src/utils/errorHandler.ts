import { AxiosError } from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const handleError = (error: AxiosError, router: AppRouterInstance) => {
  if (error.response?.status === 403) {
    alert('권한이 없어 로그인창으로 이동합니다.');
    router.push('/login');
  } else {
    alert(error.response?.data || 'Error submitting comment');
  }
};

export default handleError;
