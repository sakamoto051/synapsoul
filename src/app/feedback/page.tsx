"use client";
import { SessionProvider } from "next-auth/react";
import { FeedbackForm } from "../_components/feedback/FeedbackForm";
import { FeedbackList } from "../_components/feedback/FeedbackList";

export default function FeedbackPage() {
  return (
    <SessionProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">フィードバック</h1>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">フィードバックを送信</h2>
          <SessionProvider>
            <FeedbackForm />
          </SessionProvider>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">フィードバック一覧</h2>
          <FeedbackList />
        </div>
      </div>
    </SessionProvider>
  );
}
