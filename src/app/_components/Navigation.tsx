"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SessionProvider } from "next-auth/react";
import { UserMenu } from "./UserMenu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mainMenuItems = [
    { href: "/", label: "ホーム" },
    { href: "/books/search", label: "本を探す" },
    { href: "/books/mybooks", label: "本の管理" },
    { href: "/articles", label: "記事一覧" }, // 新しい項目を追加
  ];

  return (
    <SessionProvider>
      <nav className="bg-gray-800 text-white p-2">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="font-bold">
            SynapSoul
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {mainMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gray-300 text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <UserMenu />
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-0 h-auto">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col space-y-4 mt-8">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4">
                  <UserMenu />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </SessionProvider>
  );
};

export default Navigation;
