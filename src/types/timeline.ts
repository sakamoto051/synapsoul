export interface Character {
  id: number;
  name: string;
  color: string;
  timelineGroupId: number;
}

export interface Event {
  id: number;
  characterId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
}

export interface TimelineData {
  id: number;
  title: string;
  characters: Character[];
  events: Event[];
}
