import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';
import Providers from '@/provider/Provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: 'Board',
  description: 'created by dongku',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <MobileLayout>
        <Navbar />
        <ToastContainer position="top-center" limit={3} />
        {children}
      </MobileLayout>
    </Providers>
  );
}
