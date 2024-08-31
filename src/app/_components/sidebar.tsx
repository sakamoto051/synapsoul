"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  LibraryBig,
  Link,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Search,
} from "lucide-react";
import NextLink from "next/link";
import LoginButton from "./login-button";
import { SessionProvider } from "next-auth/react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isBooksOpen, setIsBooksOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleBooks = () => setIsBooksOpen(!isBooksOpen);

  return (
    <div
      className={`flex h-screen bg-gray-900 text-white transition-all duration-300 ${isOpen ? "w-40" : "w-16"}`}
    >
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
            {/* <NextLink href="/rooms">
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Home className="mr-2" />
                {isOpen && "Rooms"}
              </Button>
            </NextLink> */}
            <div>
              <Button
                variant="ghost"
                className="w-full justify-start mb-2"
                onClick={toggleBooks}
              >
                <LibraryBig className="mr-2" />
                {isOpen && (
                  <>
                    Books
                    {isBooksOpen ? (
                      <ChevronUp className="ml-auto" />
                    ) : (
                      <ChevronDown className="ml-auto" />
                    )}
                  </>
                )}
              </Button>
              {isOpen && isBooksOpen && (
                <div className="ml-4">
                  <NextLink href="/books/search">
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      <Search className="mr-2" />
                      Search
                    </Button>
                  </NextLink>
                  <NextLink href="/books/mybooks">
                    <Button
                      variant="ghost"
                      className="w-full justify-start mb-2"
                    >
                      <BookOpen className="mr-2" />
                      My Books
                    </Button>
                  </NextLink>
                </div>
              )}
            </div>
            {/* <NextLink href="/">
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Link className="mr-2" />
                {isOpen && "Links"}
              </Button>
            </NextLink> */}
            <SessionProvider>
              <LoginButton isOpen={isOpen} />
            </SessionProvider>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
