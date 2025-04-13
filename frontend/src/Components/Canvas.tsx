import { Layer, Stage, Rect, Group } from "react-konva";
import { ShapeRenderer } from "@/utils/shapeRenderer";
import { useState, useEffect } from "react";
import { Node } from "@/types/Canvas";

export function StageCanvas() {
  const [currentCoordinates, setCurrentCoordinates] = useState({
    top: 0,
    bottom: window.innerHeight,
    left: 0,
    right: window.innerWidth,
  });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  // Handle panning
  const handleDragMove = (e: any) => {
    const { x, y } = e.target.position();
    setStagePosition({ x, y });

    // Update visible coordinates
    setCurrentCoordinates({
      top: -y,
      bottom: -y + window.innerHeight / zoomLevel,
      left: -x,
      right: -x + window.innerWidth / zoomLevel,
    });
  };

  // Generate infinite grid lines
  const gridSize = 50; // Distance between grid lines
  const generateGridLines = () => {
    const lines = [];
    const { left, right, top, bottom } = currentCoordinates;

    // Horizontal lines
    for (
      let y = Math.floor(top / gridSize) * gridSize;
      y < bottom;
      y += gridSize
    ) {
      lines.push(
        <Rect
          key={`h-${y}`}
          x={left}
          y={y}
          width={right - left}
          height={1}
          fill="#ccc"
        />
      );
    }

    // Vertical lines
    for (
      let x = Math.floor(left / gridSize) * gridSize;
      x < right;
      x += gridSize
    ) {
      lines.push(
        <Rect
          key={`v-${x}`}
          x={x}
          y={top}
          width={1}
          height={bottom - top}
          fill="#ccc"
        />
      );
    }

    return lines;
  };

  // Filter visible nodes
  const visibleNodes = nodes.filter((node) => {
    const { x, y, width, height } = node;
    return (
      x + width >= currentCoordinates.left &&
      x <= currentCoordinates.right &&
      y + height >= currentCoordinates.top &&
      y <= currentCoordinates.bottom
    );
  });

  const onClick = (e: MouseEvent) => {
    const stage = e.target as HTMLDivElement; // Get the stage element
    const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

    // Calculate the position relative to the infinite canvas
    const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
    const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

    // Add a new node at the calculated position
    setNodes((prev) => [
      ...prev,
      {
        type: "circle",
        content: "",
        contentType: "text",
        x: canvasX,
        y: canvasY,
        width: 100,
        height: 100,
        id: `${Date.now()}`, // Unique ID based on timestamp
        layer: 0,
        borderSize: 2,
        borderColor: "#ff0000",
        borderRadius: 10,
        bgColor: "#f00",
        textColor: "ff0000",
        fontSize: 20,
      },
    ]);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onDragMove={handleDragMove}
      scaleX={zoomLevel}
      scaleY={zoomLevel}
      x={stagePosition.x}
      y={stagePosition.y}
      onClick={(e) => onClick(e.evt)}
    >
      <Layer>{generateGridLines()}</Layer>
      <Layer onClick={(e) => onClick(e.evt)}>
        {visibleNodes.map((node) => (
          <ShapeRenderer key={node.id} node={node} />
        ))}
      </Layer>
    </Stage>
  );
}
