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
    setTimelineData,
    visibleCharacters,
    isLoading: isTimelineDataLoading,
    handleSaveTimeline,
    handleDeleteTimeline,
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
      setTimelineData={setTimelineData}
      visibleCharacters={visibleCharacters}
      onSave={handleSaveTimeline}
      onAddOrUpdateEvent={handleAddOrUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
      toggleCharacterVisibility={toggleCharacterVisibility}
      onDeleteTimeline={handleDeleteTimeline}
    />
  );
};

export default TimelineDetailPage;
