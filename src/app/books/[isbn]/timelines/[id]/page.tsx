"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useTimelineData } from "~/hooks/useTimelineData";
import { CharacterSplitTimeline } from "./CharacterSplitTimeline";

const TimelineDetailPage = () => {
  const params = useParams();
  const timelineId = Number(params.id);
  const {
    timelineData,
    isLoading,
    setTimelineData,
    handleSaveTimeline,
    handleAddOrUpdateCharacter,
    handleDeleteCharacter,
    handleAddOrUpdateEvent,
    handleDeleteEvent,
  } = useTimelineData(timelineId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <CharacterSplitTimeline
      timelineData={timelineData}
      setTimelineData={setTimelineData}
      onSave={handleSaveTimeline}
      onAddOrUpdateCharacter={handleAddOrUpdateCharacter}
      onDeleteCharacter={handleDeleteCharacter}
      onAddOrUpdateEvent={handleAddOrUpdateEvent}
      onDeleteEvent={handleDeleteEvent}
    />
  );
};

export default TimelineDetailPage;
