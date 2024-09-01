"use client";
import { SessionProvider } from "next-auth/react";
import BookThreadDetail from "~/app/_components/books/thread-detail";
import ThreadDetail from "~/app/_components/books/thread/detail/ThreadDetail";

export default function ThreadDetailPage() {
  return (
    <SessionProvider>
      <ThreadDetail />
    </SessionProvider>
  );
}
