// TimelineGrid.tsx
import { uniqueId } from "lodash";
import type React from "react";

interface TimelineGridProps {
  children: React.ReactNode;
}

export const TimelineGrid: React.FC<TimelineGridProps> = ({ children }) => (
  <div className="relative h-[600px] bg-gray-800 border border-gray-600 rounded-b-lg overflow-hidden">
    {Array<number>(25)
      .fill(0)
      .map((_, i) => (
        <div
          key={uniqueId()}
          className="absolute w-full border-t border-gray-600 text-xs text-gray-400"
          style={{ top: `${(i / 24) * 100}%` }}
        >
          {i}:00
        </div>
      ))}
    {children}
  </div>
);
