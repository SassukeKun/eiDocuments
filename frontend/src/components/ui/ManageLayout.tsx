"use client";

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';

interface ManageLayoutProps {
  children: React.ReactNode;
}

const ManageLayout: React.FC<ManageLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageLayout;
