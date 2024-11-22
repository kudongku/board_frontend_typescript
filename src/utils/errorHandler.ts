import { AxiosError } from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'react-toastify';

const handleError = (error: AxiosError, router: AppRouterInstance) => {
  if (error.response?.status === 403) {
    toast('권한이 없어 로그인창으로 이동합니다.');
    router.push('/login');
  } else {
    console.log(error);
    // eslint-disable-next-line no-alert
    alert('에러가 났습니다.');
  }
};

export default handleError;
