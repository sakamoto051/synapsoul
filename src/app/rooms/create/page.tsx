"use client";
import type React from "react";
import { useRoomCreation } from "~/hooks/useRoomCreation";
import RoomForm from "~/app/_components/rooms/create/RoomForm";

const CreateRoomPage: React.FC = () => {
  const {
    roomTitle,
    setRoomTitle,
    roomContent,
    setRoomContent,
    tags,
    setTags,
    handleSubmit,
    handleTagRemove,
  } = useRoomCreation();

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-8">Create New Room</h1>
      <RoomForm
        roomTitle={roomTitle}
        roomContent={roomContent}
        tags={tags}
        onTitleChange={(e) => setRoomTitle(e.target.value)}
        onContentChange={(e) => setRoomContent(e.target.value)}
        onTagsChange={setTags}
        onTagRemove={handleTagRemove}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateRoomPage;
