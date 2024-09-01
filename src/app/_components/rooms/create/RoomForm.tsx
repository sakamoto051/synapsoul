import type React from "react";
import RoomTitleInput from "~/app/_components/rooms-create/room-title-input";
import RoomContentInput from "~/app/_components/rooms-create/room-content-input";
import TagsInput from "~/app/_components/rooms/create/TagInput";
import type { TagWithId } from "~/types/tag";

interface RoomFormProps {
  roomTitle: string;
  roomContent: string;
  tags: TagWithId[];
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onTagsChange: React.Dispatch<React.SetStateAction<TagWithId[]>>;
  onTagRemove: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
  roomTitle,
  roomContent,
  tags,
  onTitleChange,
  onContentChange,
  onTagsChange,
  onTagRemove,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6 max-w-2xl">
    <RoomTitleInput value={roomTitle} onChange={onTitleChange} />
    <RoomContentInput value={roomContent} onChange={onContentChange} />
    <TagsInput
      tags={tags}
      setTags={onTagsChange}
      handleTagRemove={onTagRemove}
    />
    <button
      type="submit"
      className="bg-green-800 text-white rounded-md px-6 py-2 hover:bg-green-700 transition-colors"
    >
      Create Room
    </button>
  </form>
);

export default RoomForm;
