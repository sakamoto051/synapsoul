import React from 'react';
import { Home, Link } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <nav className="space-y-2">
        <div className="bg-gray-700 rounded-md p-2">
          <a href="/rooms" className="flex items-center space-x-2">
            <Home className="w-5 h-5" />
            <span>Rooms</span>
          </a>
        </div>
        <div className="bg-gray-600 rounded-md p-2">
          <a href="#" className="flex items-center space-x-2">
            <Link className="w-5 h-5" />
            <span>Links</span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;