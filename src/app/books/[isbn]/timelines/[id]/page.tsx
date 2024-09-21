// src/app/books/[isbn]/timelines/[id]/page.tsx
"use client";
import React from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useTimelineData } from "~/hooks/useTimelineData";
import { TimelinePage } from "./TimelinePage";
import { Loader2 } from "lucide-react";

const TimelineDetailPage = () => {
  const params = useParams();
  const timelineId = Number(params.id);

  const { data: timelineBasicInfo, isLoading: isTimelineInfoLoading } =
    api.timeline.getBasicInfo.useQuery(
      { id: timelineId },
      { enabled: !!timelineId },
    );

  const {
    timelineData,
    visibleCharacters,
    isLoading: isTimelineDataLoading,
    handleSaveTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
    toggleCharacterVisibility,
  } = useTimelineData(timelineId);

  if (isTimelineInfoLoading || isTimelineDataLoading || !timelineData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!timelineBasicInfo) {
    return <div>Timeline not found</div>;
  }

  return (
    <TimelinePage
      timelineData={timelineData}
      visibleCharacters={visibleCharacters}
      onSave={handleSaveTimeline}
      onAddOrUpdateCharacter={handleAddOrUpdateCharacter}
      onDeleteCharacter={handleDeleteCharacter}
      onAddOrUpdateEvent={handleAddOrUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
      toggleCharacterVisibility={toggleCharacterVisibility}
    />
  );
};

export default TimelineDetailPage;
