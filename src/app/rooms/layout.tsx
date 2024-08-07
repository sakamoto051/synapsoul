import React from 'react';
import Sidebar from '../_components/sidebar';

const MainPage = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex text-white min-h-screen">
      <Sidebar />
      <main className="flex-grow p-8 bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default MainPage;