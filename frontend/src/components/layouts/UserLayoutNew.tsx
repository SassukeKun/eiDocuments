'use client';

import UserSidebar from '@/components/ui/UserSidebar';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <UserSidebar />
      
      {/* Main content */}
      <div className="flex-1">
        {/* Page content */}
        <main className="p-6 h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
