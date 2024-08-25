'use client';
import React, { useState } from 'react';
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Home, Link } from "lucide-react";
import NextLink from 'next/link';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`flex h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? 'w-40' : 'w-16'}`}>
      <div className="flex flex-col flex-grow">
        <div className="p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mb-4"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
          <nav>
            <NextLink href="/rooms">
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Home className="mr-2" />
                {isOpen && "Rooms"}
              </Button>
            </NextLink>
            <NextLink href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Link className="mr-2" />
                {isOpen && "Links"}
              </Button>
            </NextLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;