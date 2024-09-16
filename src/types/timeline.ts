export interface Character {
  id: number;
  name: string;
  color: string;
}

export interface Event {
  id: number;
  characterId: number;
  action: string;
  startTime: string;
  endTime: string;
}

export interface TimelineData {
  id: number;
  title: string;
  characters: Character[];
  events: Event[];
}
