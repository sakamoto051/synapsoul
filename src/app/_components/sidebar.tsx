"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LibraryBig,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Search,
  Settings,
  Menu,
} from "lucide-react";
import NextLink from "next/link";
import LoginButton from "./login-button";
import { SessionProvider } from "next-auth/react";
import { useMediaQuery } from "~/hooks/useMediaQuery";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleBooks = () => setIsBooksOpen(!isBooksOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    if (isDesktop) {
      setIsMobileMenuOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 pt-12">
        {isDesktop && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mb-4"
          >
            {isOpen ? <ChevronLeft /> : <ChevronRight />}
          </Button>
        )}
        <nav>
          <div>
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={toggleBooks}
            >
              <LibraryBig className="mr-2" />
              {(isOpen || !isDesktop) && (
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
            {(isOpen || !isDesktop) && isBooksOpen && (
              <div className="ml-4">
                <NextLink href="/books/search">
                  <Button variant="ghost" className="w-full justify-start mb-2">
                    <Search className="mr-2" />
                    Search
                  </Button>
                </NextLink>
                <NextLink href="/books/mybooks">
                  <Button variant="ghost" className="w-full justify-start mb-2">
                    <BookOpen className="mr-2" />
                    My Books
                  </Button>
                </NextLink>
                <NextLink href="/books/data-import">
                  <Button variant="ghost" className="w-full justify-start mb-2">
                    <BookOpen className="mr-2" />
                    データインポート
                  </Button>
                </NextLink>
              </div>
            )}
          </div>
          <SessionProvider>
            <NextLink href="/settings" passHref>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <Settings className="mr-2" />
                {(isOpen || !isDesktop) && "Settings"}
              </Button>
            </NextLink>
            <LoginButton isOpen={isOpen || !isDesktop} />
          </SessionProvider>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {!isDesktop && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <Menu />
        </Button>
      )}
      <div
        ref={sidebarRef}
        className={`
          ${isDesktop ? "relative" : "fixed inset-y-0 left-0 z-40"}
          ${isDesktop && isOpen ? "w-52" : isDesktop ? "w-20" : "w-52"}
          ${!isDesktop && (isMobileMenuOpen ? "translate-x-0" : "-translate-x-full")}
          flex h-screen bg-gray-900 text-white transition-all duration-1000 ease-in-out
        `}
      >
        <SidebarContent />
      </div>
      {!isDesktop && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onMouseUp={toggleMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
