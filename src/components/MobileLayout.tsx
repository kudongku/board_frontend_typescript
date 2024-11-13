import { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="max-w-[700px] mx-auto h-screen overflow-y-auto">
      {children}
    </div>
  );
}

export default MobileLayout;
