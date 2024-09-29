// src/app/layout.tsx
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/toaster";
import Navigation from "./_components/Navigation";
import { AuthStateManager } from "./_components/AuthStateManager";
import { SessionProviderManager } from "./_components/SessionProviderManager";
import { GuestCautionMessage } from "./_components/GuestCautionMessage";
import "github-markdown-css/github-markdown.css";

export const metadata: Metadata = {
  title: {
    default: "SynapsoulBooks - あなたの読書管理アプリ",
    template: "%s | SynapsoulBooks",
  },
  description:
    "読書管理と読書ノート作成のためのパーソナルライブラリーマネージャー",
  keywords: [
    "読書",
    "本",
    "図書館",
    "読書管理",
    "読書ノート",
    "書籍レビュー",
    "書評",
  ],
  authors: [{ name: "Hutonman" }],
  creator: "Hutonman",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://synapsoul.vercel.app/",
    siteName: "SynapsoulBooks",
    images: [
      {
        url: "https://files.oaiusercontent.com/file-P7KxDhPWd0SeEzi3KVhkdnyU?se=2024-09-03T20%3A52%3A12Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D0ac9bdc4-766c-4bb5-b3ef-53d6a2c95060.webp&sig=1cYTfN0XSiUOvljNxXNPkLbRe%2BgmaJGou29bMIlzAeI%3D",
        width: 600,
        height: 660,
        alt: "SynapsoulBooks - あなたの読書生活をサポート",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${GeistSans.variable}`}>
      <body className="bg-gray-900 min-h-screen flex flex-col">
        <TRPCReactProvider>
          <SessionProviderManager>
            <AuthStateManager />
            <Navigation />
          </SessionProviderManager>
          <main className="container text-white flex-grow bg-gray-900 p-2 sm:p-4">
            <SessionProviderManager>
              <GuestCautionMessage />
            </SessionProviderManager>
            {children}
          </main>
          <Toaster />
        </TRPCReactProvider>
        <Analytics />
      </body>
    </html>
  );
}
