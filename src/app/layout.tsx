import type { Metadata } from 'next';
import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import MobileLayout from '@/components/MobileLayout';

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
    <MobileLayout>
      <Navbar />
      {children}
    </MobileLayout>
  );
}
