import type React from "react";
import { useEffect, useRef, useCallback } from "react";

export const TimelineConnector = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const drawConnections = useCallback(() => {
    if (svgRef.current) {
      const svg = svgRef.current;
      const timelineElements = document.querySelectorAll(".timeline-item");

      // Clear existing lines
      while (svg.firstChild) {
        svg.removeChild(svg.firstChild);
      }

      // Draw lines between timeline items
      for (let i = 0; i < timelineElements.length - 1; i++) {
        const startElement = timelineElements[i];
        const endElement = timelineElements[i + 1];

        if (!startElement || !endElement) continue;

        const start = startElement.getBoundingClientRect();
        const end = endElement.getBoundingClientRect();

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        line.setAttribute("x1", `${start.left + start.width / 2}`);
        line.setAttribute("y1", `${start.top + start.height}`);
        line.setAttribute("x2", `${end.left + end.width / 2}`);
        line.setAttribute("y2", `${end.top}`);
        line.setAttribute("stroke", "rgb(59, 130, 246)");
        line.setAttribute("stroke-width", "2");

        svg.appendChild(line);
      }
    }
  }, []);

  useEffect(() => {
    drawConnections();
    window.addEventListener("resize", drawConnections);
    return () => {
      window.removeEventListener("resize", drawConnections);
    };
  }, [drawConnections]);

  useEffect(() => {
    drawConnections();
  }, [drawConnections]);

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};
