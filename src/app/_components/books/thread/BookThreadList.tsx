// src/components/BookThreadList.tsx
import type React from "react";
import { useParams } from "next/navigation";
import { useBookThreads } from "~/hooks/useBookThreads";
import { NewThreadForm } from "./NewThreadForm";
import { ThreadCard } from "./ThreadCard";

const BookThreadList: React.FC = () => {
  const params = useParams();
  const isbn = params.isbn as string;

  const {
    threads,
    newThreadTitle,
    setNewThreadTitle,
    newThreadContent,
    setNewThreadContent,
    handleCreateThread,
    navigateToThread,
  } = useBookThreads(isbn);

  return (
    <div className="mt-8">
      <NewThreadForm
        title={newThreadTitle}
        content={newThreadContent}
        onTitleChange={setNewThreadTitle}
        onContentChange={setNewThreadContent}
        onSubmit={handleCreateThread}
      />

      {threads?.map((thread) => (
        <ThreadCard
          key={thread.id}
          thread={thread}
          onNavigate={navigateToThread}
        />
      ))}
    </div>
  );
};

export default BookThreadList;
