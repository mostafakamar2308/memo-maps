import { Layer, Stage, Rect, Ellipse, Shape } from "react-konva";
import { useState } from "react";
import { Node, Tool } from "@/types/Canvas";
import { ShapeRenderer } from "@/Components/ShapeRenderer";
import { getRandomHSLColor } from "@/utils/colors";

type Props = {
  activeTool: Tool;
};

export function StageCanvas({ activeTool }: Props) {
  const [zoomLevel, setZoomLevel] = useState(1); // Current zoom level
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 }); // Panning offset
  const [nodes, setNodes] = useState<Node[]>([]); // List of nodes
  const [isPanning, setIsPanning] = useState(false); // Track if panning is active
  const [isDrawing, setIsDrawing] = useState(false); // Track if drawing is active
  const [tempCircle, setTempCircle] = useState<{
    centerX: number;
    centerY: number;
    startX: number;
    startY: number;
    radiusX: number;
    radiusY: number;
  } | null>(null); // Temporary circle state

  const [tempShape, setTempShape] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [tempRhomboid, setTempRhomboid] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  // Calculate extended bounds (200% of visible area)
  const getExtendedBounds = () => {
    const viewportWidth = window.innerWidth / zoomLevel;
    const viewportHeight = window.innerHeight / zoomLevel;

    const centerX = -stagePosition.x / zoomLevel;
    const centerY = -stagePosition.y / zoomLevel;

    return {
      left: centerX - viewportWidth * 1.5,
      right: centerX + viewportWidth * 2,
      top: centerY - viewportHeight * 1.5,
      bottom: centerY + viewportHeight * 2,
    };
  };

  // Filter nodes within the extended bounds
  const visibleNodes = nodes.filter((node) => {
    const { left, right, top, bottom } = getExtendedBounds();
    const nodeRadius = Math.max(node.width, node.height) / 2; // Approximate radius for circles
    return (
      node.x - nodeRadius <= right &&
      node.x + nodeRadius >= left &&
      node.y - nodeRadius <= bottom &&
      node.y + nodeRadius >= top
    );
  });

  // Handle mouse down for panning or drawing
  const handleMouseDown = (e: MouseEvent) => {
    if (e.ctrlKey) {
      // Start panning if Ctrl is pressed
      setIsPanning(true);
    }
    if (!e.ctrlKey && activeTool === "eclipse") {
      // Start drawing a circle otherwise
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the position relative to the infinite canvas
      const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

      // Start drawing a new circle
      setIsDrawing(true);
      setTempCircle({
        startX: canvasX,
        centerX: canvasX,
        startY: canvasY,
        centerY: canvasY,
        radiusX: 0,
        radiusY: 0,
      });
    }

    if (!e.ctrlKey && activeTool === "square") {
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the position relative to the infinite canvas
      const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

      setIsDrawing(true);
      setTempShape({
        x: canvasX,
        y: canvasY,
        width: 0,
        height: 0,
      });
    }
    if (!e.ctrlKey && activeTool === "diamond") {
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the position relative to the infinite canvas
      const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;
      console.log("Canvas Position:", { canvasX, canvasY });

      setIsDrawing(true);
      setTempRhomboid({
        startX: canvasX,
        startY: canvasY,
        endX: canvasX,
        endY: canvasY,
      });
    }
  };

  // Handle mouse move for panning or resizing the circle
  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning && e.ctrlKey) {
      // Pan the canvas
      setStagePosition((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }

    if (activeTool === "eclipse" && isDrawing && tempCircle) {
      // Resize the circle
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the current mouse position relative to the infinite canvas
      const mouseX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

      const centerX = (mouseX + tempCircle.startX) / 2;
      const centerY = (mouseY + tempCircle.startY) / 2;

      // Calculate the radius based on the distance from the initial click position
      const radiusX = Math.abs(mouseX - centerX);
      const radiusY = Math.abs(mouseY - centerY);

      // Update the temporary circle's radius
      setTempCircle((prev) =>
        prev ? { ...prev, radiusX, radiusY, centerX, centerY } : null
      );
    }
    if (activeTool === "square" && isDrawing && tempShape) {
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the current mouse position relative to the infinite canvas
      const mouseX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const mouseY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

      const width = mouseX - tempShape.x;
      const height = mouseY - tempShape.y;

      if (tempShape)
        setTempShape({ x: tempShape.x, y: tempShape.y, width, height });
    }

    if (activeTool === "diamond" && isDrawing && tempRhomboid) {
      const stage = e.target as HTMLDivElement; // Get the stage element
      const rect = stage.getBoundingClientRect(); // Get the bounding rectangle

      // Calculate the current mouse position relative to the infinite canvas
      const canvasX = (e.clientX - rect.left - stagePosition.x) / zoomLevel;
      const canvasY = (e.clientY - rect.top - stagePosition.y) / zoomLevel;

      setTempRhomboid({
        startX: tempRhomboid.startX,
        startY: tempRhomboid.startY,
        endX: canvasX,
        endY: canvasY,
      });
    }
  };

  // Handle mouse up to stop panning or finalize the circle
  const handleMouseUp = () => {
    if (isPanning) {
      // Stop panning
      setIsPanning(false);
    }

    if (activeTool === "eclipse" && isDrawing && tempCircle) {
      // Finalize the circle
      setNodes((prev) => [
        ...prev,
        {
          type: "circle",
          x: tempCircle.centerX,
          y: tempCircle.centerY,
          width: tempCircle.radiusX, // Diameter
          height: tempCircle.radiusY, // Diameter
          content: "",
          contentType: "text",
          layer: 1,
          bgColor: getRandomHSLColor(), // Set a default fill color
          id: `${Date.now()}`, // Unique ID based on timestamp
        },
      ]);

      // Reset drawing state
      setIsDrawing(false);
      setTempCircle(null);
    }
    if (activeTool === "square" && isDrawing && tempShape) {
      setNodes((prev) => [
        ...prev,
        {
          type: activeTool,
          x: tempShape.x,
          y: tempShape.y,
          width: tempShape.width,
          height: tempShape.height,
          content: "",
          contentType: "text",
          layer: 1,
          bgColor: getRandomHSLColor(), // Set a default fill color
          id: `${Date.now()}`, // Unique ID based on timestamp
        },
      ]);

      setIsDrawing(false);
      setTempShape(null);
    }

    if (activeTool === "diamond" && isDrawing && tempRhomboid) {
      const { startX, startY, endX, endY } = tempRhomboid;

      const centerX = (startX + endX) / 2;
      const centerY = (startY + endY) / 2;

      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      // Calculate absolute points for the diamond
      const absolutePoints = [
        centerX,
        centerY - height / 2, // Top vertex
        centerX + width / 2,
        centerY, // Right vertex
        centerX,
        centerY + height / 2, // Bottom vertex
        centerX - width / 2,
        centerY, // Left vertex
      ];

      // Calculate the bounding box of the diamond
      const xs = [
        absolutePoints[0],
        absolutePoints[2],
        absolutePoints[4],
        absolutePoints[6],
      ];
      const ys = [
        absolutePoints[1],
        absolutePoints[3],
        absolutePoints[5],
        absolutePoints[7],
      ];

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      // Calculate width and height
      const width1 = maxX - minX;
      const height2 = maxY - minY;

      // Convert points to be relative to the top-left corner of the bounding box (minX, minY)
      const relativePoints = absolutePoints.map((coord, index) =>
        index % 2 === 0 ? coord - minX : coord - minY
      );

      const newDiamond: Node = {
        id: Date.now().toString(),
        x: minX, // Set group's x to the top-left corner (minX)
        y: minY, // Set group's y to the top-left corner (minY)
        width: width1,
        height: height2,
        type: "diamond",
        contentType: "text",
        content: "",
        points: relativePoints, // Relative to top-left corner (minX, minY)
        closed: true,
        layer: 1,
        borderSize: 2,
        borderColor: "black",
        bgColor: getRandomHSLColor(),
        textColor: "black",
        fontSize: 16,
      };

      setNodes((prevNodes) => [...prevNodes, newDiamond]);

      setIsDrawing(false);
      setTempRhomboid(null);
    }
  };

  const renderTempRhomboid = () => {
    if (!tempRhomboid) return null;

    const { startX, startY, endX, endY } = tempRhomboid;
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    const points = [
      centerX,
      centerY - height / 2, // Top vertex
      centerX + width / 2,
      centerY, // Right vertex
      centerX,
      centerY + height / 2, // Bottom vertex
      centerX - width / 2,
      centerY, // Left vertex
    ];

    return (
      <Shape
        sceneFunc={(context) => {
          context.beginPath();
          context.moveTo(points[0], points[1]);
          for (let i = 2; i < points.length; i += 2) {
            context.lineTo(points[i], points[i + 1]);
          }
          context.closePath();
          context.stroke();
        }}
        stroke="black"
        strokeWidth={2}
      />
    );
  };

  // Handle zooming with Ctrl + Wheel
  const handleWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) return; // Only zoom if Ctrl is pressed

    e.preventDefault();
    const scaleBy = 1.1; // Zoom factor
    const newZoomLevel =
      e.deltaY > 0 ? zoomLevel / scaleBy : zoomLevel * scaleBy;

    // Prevent zooming too far in or out
    if (newZoomLevel < 0.1 || newZoomLevel > 10) return;

    // Calculate the mouse position relative to the stage
    const mouseX = e.clientX - stagePosition.x;
    const mouseY = e.clientY - stagePosition.y;

    // Adjust the stage position to keep the zoom centered on the mouse pointer
    setStagePosition({
      x: e.clientX - (mouseX / zoomLevel) * newZoomLevel,
      y: e.clientY - (mouseY / zoomLevel) * newZoomLevel,
    });

    // Update the zoom level
    setZoomLevel(newZoomLevel);
  };

  // Generate adaptive grid lines
  const gridSize = 20; // Base distance between grid lines
  const generateGridLines = () => {
    const { left, right, top, bottom } = getExtendedBounds();

    // Adjust grid size based on zoom level
    const effectiveGridSize = gridSize * Math.max(zoomLevel, 1);

    const lines = [];

    // Horizontal lines
    for (
      let y = Math.floor(top / effectiveGridSize) * effectiveGridSize;
      y < bottom;
      y += effectiveGridSize
    ) {
      lines.push(
        <Rect
          key={`h-${y}`}
          x={left}
          y={y}
          width={right - left}
          height={1 / zoomLevel} // Scale line thickness
          fill="#ccc"
        />
      );
    }

    // Vertical lines
    for (
      let x = Math.floor(left / effectiveGridSize) * effectiveGridSize;
      x < right;
      x += effectiveGridSize
    ) {
      lines.push(
        <Rect
          key={`v-${x}`}
          x={x}
          y={top}
          width={1 / zoomLevel} // Scale line thickness
          height={bottom - top}
          fill="#ccc"
        />
      );
    }

    return lines;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable={false} // Disable default dragging behavior
      onMouseDown={(e) => handleMouseDown(e.evt)}
      onMouseMove={(e) => handleMouseMove(e.evt)}
      onMouseUp={() => handleMouseUp()}
      onWheel={(e) => handleWheel(e.evt)}
      scaleX={zoomLevel}
      scaleY={zoomLevel}
      x={stagePosition.x}
      y={stagePosition.y}
    >
      <Layer>{generateGridLines()}</Layer>

      {/* Render only visible nodes */}
      <Layer>
        {visibleNodes.map((node) => (
          <ShapeRenderer key={node.id} node={node} />
        ))}
      </Layer>

      {/* Render temporary circle while drawing */}
      <Layer>
        {tempCircle && (
          <Ellipse
            x={tempCircle.centerX}
            y={tempCircle.centerY}
            radiusX={tempCircle.radiusX}
            radiusY={tempCircle.radiusY}
            stroke="#f00"
            strokeWidth={2}
          />
        )}
        {activeTool === "diamond" && tempRhomboid && renderTempRhomboid()}

        {activeTool === "square" && tempShape && (
          <Rect
            x={tempShape.x}
            y={tempShape.y}
            width={tempShape.width}
            height={tempShape.height}
            stroke="#f00"
            strokeWidth={2}
          />
        )}
      </Layer>
    </Stage>
  );
}
