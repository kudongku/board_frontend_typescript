import { AuthProvider } from '@/provider/contexts/authContext';
import { ReactNode } from 'react';

function Providers({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

export default Providers;
