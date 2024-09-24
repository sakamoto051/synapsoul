// src/components/Navigation.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Home,
  Search,
  BookOpen,
  MessageSquare,
  Settings,
  Download,
} from "lucide-react";
import LoginButton from "./LoginButton";
import { SessionProvider } from "next-auth/react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/", label: "ホーム", icon: Home },
    { href: "/books/search", label: "本を探す", icon: Search },
    { href: "/books/mybooks", label: "本の管理", icon: BookOpen },
    { href: "/books/data-import", label: "データ取り込み", icon: Download },
    { href: "/feedback", label: "フィードバック", icon: MessageSquare },
    { href: "/settings", label: "設定", icon: Settings },
  ];

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          SynapSoul
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-gray-300 flex items-center"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
          <SessionProvider>
            <LoginButton />
          </SessionProvider>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <SessionProvider>
                <LoginButton />
              </SessionProvider>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;
