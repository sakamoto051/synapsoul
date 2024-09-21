export interface Character {
  id: number;
  name: string;
  color: string;
  bookId: number;
  isVisible?: boolean;
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
