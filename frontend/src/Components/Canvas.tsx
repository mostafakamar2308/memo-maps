import { Layer, Stage, Rect, Ellipse, Shape, Line } from "react-konva";
import { useCallback, useMemo, useRef, useState } from "react";
import { Node, Tool } from "@/types/Canvas";
import { ShapeRenderer } from "@/Components/ShapeRenderer";
import { getRandomHSLColor } from "@/utils/colors";
import { Sidebar } from "@/Components/Sidebar";
import { getCoordinates } from "@/utils/coordinates";
import Konva from "konva";

type Props = {
  activeTool: Tool;
  changeActiveTool: (tool: Tool) => void;
};

export function StageCanvas({ activeTool, changeActiveTool }: Props) {
  const stageRef = useRef<Konva.Stage>(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Current zoom level
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const [stagePosition, setStagePosition] = useState({
    canvasX: 0,
    canvasY: 0,
  }); // Panning offset
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

  const [tempSquare, setTempSquare] = useState<{
    canvasX: number;
    canvasY: number;
    width: number;
    height: number;
  } | null>(null);

  const [tempRhomboid, setTempRhomboid] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  } | null>(null);

  const [tempHandDrawnLine, setTempHandDrawnLine] = useState<number[] | null>(
    null
  );
  const [tempArrow, setTempArrow] = useState<{
    start: { canvasX: number; canvasY: number };
    end: { canvasX: number; canvasY: number };
  } | null>(null);

  // Calculate extended bounds (200% of visible area)
  const getExtendedBounds = useCallback(() => {
    const viewportWidth = window.innerWidth / zoomLevel;
    const viewportHeight = window.innerHeight / zoomLevel;

    const centerX = -stagePosition.canvasX / zoomLevel;
    const centerY = -stagePosition.canvasY / zoomLevel;

    return {
      left: centerX - viewportWidth * 1.5,
      right: centerX + viewportWidth * 2,
      top: centerY - viewportHeight * 1.5,
      bottom: centerY + viewportHeight * 2,
    };
  }, [zoomLevel, stagePosition]);

  console.log({ nodes });

  // Filter nodes within the extended bounds
  const visibleNodes = useMemo(
    () =>
      nodes.filter((node) => {
        const { left, right, top, bottom } = getExtendedBounds();
        const nodeRadius = Math.max(node.width, node.height) / 2; // Approximate radius for circles
        return (
          node.canvasX - nodeRadius <= right &&
          node.canvasX + nodeRadius >= left &&
          node.canvasY - nodeRadius <= bottom &&
          node.canvasY + nodeRadius >= top
        );
      }),
    [nodes, getExtendedBounds]
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (e.ctrlKey) return setIsPanning(true);

      setIsDrawing(true);

      if (activeTool === "eclipse") {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        // Start drawing a new circle
        setTempCircle({
          startX: canvasX,
          centerX: canvasX,
          startY: canvasY,
          centerY: canvasY,
          radiusX: 0,
          radiusY: 0,
        });
      }

      if (activeTool === "square") {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        setTempSquare({
          canvasX: canvasX,
          canvasY: canvasY,
          width: 0,
          height: 0,
        });
      }

      if (activeTool === "diamond") {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        setTempRhomboid({
          startX: canvasX,
          startY: canvasY,
          endX: canvasX,
          endY: canvasY,
        });
      }

      if (activeTool === "hand-drawn") {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        setTempHandDrawnLine([canvasX, canvasY]);
      }

      if (activeTool === "line") {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );
        setTempArrow({
          start: { canvasX: canvasX, canvasY: canvasY },
          end: { canvasX: canvasX, canvasY: canvasY },
        });
      }
    },
    [activeTool, stagePosition, zoomLevel]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isPanning && e.ctrlKey)
        return setStagePosition((prev) => ({
          canvasX: prev.canvasX + e.movementX,
          canvasY: prev.canvasY + e.movementY,
        }));

      if (activeTool === "eclipse" && isDrawing && tempCircle) {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        const centerX = (canvasX + tempCircle.startX) / 2;
        const centerY = (canvasY + tempCircle.startY) / 2;

        // Calculate the radius based on the distance from the initial click position
        const radiusX = Math.abs(canvasX - centerX);
        const radiusY = Math.abs(canvasY - centerY);

        // Update the temporary circle's radius
        setTempCircle((prev) =>
          prev ? { ...prev, radiusX, radiusY, centerX, centerY } : null
        );
      }

      if (activeTool === "square" && isDrawing && tempSquare) {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        const width = canvasX - tempSquare.canvasX;
        const height = canvasY - tempSquare.canvasY;

        if (tempSquare)
          setTempSquare({
            canvasX: tempSquare.canvasX,
            canvasY: tempSquare.canvasY,
            width,
            height,
          });
      }

      if (activeTool === "diamond" && isDrawing && tempRhomboid) {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        setTempRhomboid({
          startX: tempRhomboid.startX,
          startY: tempRhomboid.startY,
          endX: canvasX,
          endY: canvasY,
        });
      }

      if (activeTool === "hand-drawn" && isDrawing && tempHandDrawnLine) {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        if (tempHandDrawnLine)
          setTempHandDrawnLine([...tempHandDrawnLine, canvasX, canvasY]);
      }

      if (activeTool === "line" && isDrawing && tempArrow) {
        const { canvasX, canvasY } = getCoordinates(
          e,
          zoomLevel,
          stagePosition
        );

        setTempArrow((prev) =>
          prev ? { ...prev, end: { canvasX: canvasX, canvasY: canvasY } } : null
        );
      }
    },
    [
      tempArrow,
      tempCircle,
      tempHandDrawnLine,
      tempRhomboid,
      tempSquare,
      activeTool,
      isDrawing,
      isPanning,
      zoomLevel,
      stagePosition,
    ]
  );

  // Handle mouse up to stop panning or finalize the circle
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    // Reset drawing state
    setIsDrawing(false);
    setTempCircle(null);
    setTempSquare(null);
    setTempRhomboid(null);
    setTempHandDrawnLine(null);
    setTempArrow(null);
    changeActiveTool("select");

    if (!isDrawing) return;

    if (activeTool === "eclipse" && tempCircle)
      // Finalize the circle
      setNodes((prev) => [
        ...prev,
        {
          type: "circle",
          canvasX: tempCircle.centerX,
          canvasY: tempCircle.centerY,
          width: tempCircle.radiusX,
          height: tempCircle.radiusY,
          content: "",
          contentType: "text",
          layer: 1,
          bgColor: getRandomHSLColor(),
          id: `${Date.now()}`,
        },
      ]);

    if (activeTool === "square" && tempSquare)
      setNodes((prev) => [
        ...prev,
        {
          type: activeTool,
          canvasX: tempSquare.canvasX,
          canvasY: tempSquare.canvasY,
          width: tempSquare.width,
          height: tempSquare.height,
          content: "",
          contentType: "text",
          layer: 1,
          bgColor: getRandomHSLColor(),
          id: `${Date.now()}`,
        },
      ]);

    if (activeTool === "diamond" && tempRhomboid) {
      const { startX, startY, endX, endY } = tempRhomboid;

      const centerX = (startX + endX) / 2;
      const centerY = (startY + endY) / 2;

      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

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
        canvasX: minX,
        canvasY: minY,
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
    }

    if (activeTool === "hand-drawn" && tempHandDrawnLine) {
      const firstPoint = [tempHandDrawnLine[0], tempHandDrawnLine[1]];
      const tempLineLength = tempHandDrawnLine.length;

      const lastPoint = [
        tempHandDrawnLine[tempLineLength - 1],
        tempHandDrawnLine[tempLineLength - 2],
      ];

      const distance = Math.sqrt(
        Math.pow(firstPoint[0] - lastPoint[0], 2) +
          Math.pow(firstPoint[1] - lastPoint[1], 2)
      );

      setNodes((prev) => [
        ...prev,
        {
          type: "hand-drawn",
          canvasX: firstPoint[0],
          canvasY: firstPoint[1],
          width: distance,
          height: distance,
          points: tempHandDrawnLine,
          content: "",
          contentType: "text",
          layer: 1,
          bgColor: getRandomHSLColor(),
          id: `${Date.now()}`,
        },
      ]);
    }

    if (activeTool === "line" && tempArrow)
      setNodes((prev) => [
        ...prev,
        {
          type: "line",
          canvasX: tempArrow.start.canvasX,
          canvasY: tempArrow.start.canvasY,
          points: [
            tempArrow.start.canvasX,
            tempArrow.start.canvasY,
            tempArrow.end.canvasX,
            tempArrow.end.canvasY,
          ],
          width: 5,
          height: 5,
          layer: 1,
          content: "",
          contentType: "text",
          borderColor: "#000",
          borderSize: 2,
          id: Date.now().toString(),
        },
      ]);
  }, [
    activeTool,
    tempArrow,
    tempCircle,
    tempHandDrawnLine,
    tempRhomboid,
    tempSquare,
    isDrawing,
    changeActiveTool,
  ]);

  const createText = (e: MouseEvent) => {
    const { canvasX, canvasY } = getCoordinates(e, zoomLevel, stagePosition);

    const newTextNode: Node = {
      id: Date.now().toString(),
      type: "text",
      canvasX: canvasX,
      absoluteX: e.x,
      canvasY: canvasY,
      absoluteY: e.y,
      width: 100,
      height: 30,
      content: "Hello World",
      contentType: "text",
      layer: 1,
      bgColor: "transparent",
      borderColor: "black",
      borderSize: 1,
      textColor: "black",
      fontSize: 16,
    };

    setSelectedShape(newTextNode.id);
    setNodes((prev) => [...prev, newTextNode]);
  };

  const renderTempRhomboid = useMemo(() => {
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
  }, [tempRhomboid]);

  // Handle zooming with Ctrl + Wheel
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!e.ctrlKey) return; // Only zoom if Ctrl is pressed

      e.preventDefault();
      const scaleBy = 1.1; // Zoom factor
      const newZoomLevel =
        e.deltaY > 0 ? zoomLevel / scaleBy : zoomLevel * scaleBy;

      // Prevent zooming too far in or out
      if (newZoomLevel < 0.1 || newZoomLevel > 10) return;

      // Calculate the mouse position relative to the stage
      const mouseX = e.clientX - stagePosition.canvasX;
      const mouseY = e.clientY - stagePosition.canvasY;

      // Adjust the stage position to keep the zoom centered on the mouse pointer
      setStagePosition({
        canvasX: e.clientX - (mouseX / zoomLevel) * newZoomLevel,
        canvasY: e.clientY - (mouseY / zoomLevel) * newZoomLevel,
      });

      // Update the zoom level
      setZoomLevel(newZoomLevel);
    },
    [zoomLevel, stagePosition]
  );

  const getArrowHeadPoints = useCallback((data: typeof tempArrow) => {
    if (!data) return;
    const { start, end } = data;
    const dx = end.canvasX - start.canvasX;
    const dy = end.canvasY - start.canvasY;
    const angle = Math.atan2(dy, dx);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    return [
      {
        canvasX: end.canvasX - arrowLength * Math.cos(angle - arrowAngle),
        canvasY: end.canvasY - arrowLength * Math.sin(angle - arrowAngle),
      },
      {
        canvasX: end.canvasX - arrowLength * Math.cos(angle + arrowAngle),
        canvasY: end.canvasY - arrowLength * Math.sin(angle + arrowAngle),
      },
    ];
  }, []);

  const changeProp = useCallback(
    <K extends keyof Node>(prop: K, value: Node[K], id: string) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id === id) {
            return { ...node, [prop]: value };
          }
          return node;
        })
      );
    },
    []
  );

  // Generate adaptive grid lines
  const generateGridLines = useCallback(() => {
    const gridSize = 20; // Base distance between grid lines
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
  }, [getExtendedBounds, zoomLevel]);

  return (
    <>
      <Stage
        id="canva222"
        className="relative"
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        draggable={false}
        onMouseDown={(e) => {
          if (e.target.getAttr("id") === stageRef.current?.getAttr("id")) {
            console.log("setting selected shape to null");
            setSelectedShape(null);
          }
          handleMouseDown(e.evt);
        }}
        onMouseMove={(e) => handleMouseMove(e.evt)}
        onMouseUp={() => handleMouseUp()}
        onWheel={(e) => handleWheel(e.evt)}
        onDblClick={(e) => {
          if (e.target.getAttr("id") === stageRef.current?.getAttr("id"))
            createText(e.evt);
        }}
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.canvasX}
        y={stagePosition.canvasY}
      >
        <Layer id="canvas-1">{generateGridLines()}</Layer>

        {/* Render only visible nodes */}
        <Layer id="canvas-2">
          {visibleNodes.map((node) => (
            <ShapeRenderer
              isSelected={node.id === selectedShape}
              onSelect={setSelectedShape}
              onChange={(id, text) =>
                setNodes((prev) =>
                  prev.map((node) =>
                    node.id === id ? { ...node, content: text } : node
                  )
                )
              }
              stage={stageRef.current}
              currentTool={activeTool}
              key={node.id}
              node={node}
            />
          ))}
        </Layer>

        {/* Render temporary circle while drawing */}
        <Layer id="canvas-3">
          {activeTool === "eclipse" && tempCircle && (
            <Ellipse
              x={tempCircle.centerX}
              y={tempCircle.centerY}
              radiusX={tempCircle.radiusX}
              radiusY={tempCircle.radiusY}
              stroke="#f00"
              strokeWidth={2}
            />
          )}

          {activeTool === "diamond" && tempRhomboid && renderTempRhomboid}

          {activeTool === "square" && tempSquare && (
            <Rect
              x={tempSquare.canvasX}
              y={tempSquare.canvasY}
              width={tempSquare.width}
              height={tempSquare.height}
              stroke="#f00"
              strokeWidth={2}
            />
          )}

          {"line" === activeTool && tempArrow && (
            <>
              <Line
                points={[
                  tempArrow.start.canvasX,
                  tempArrow.start.canvasY,
                  tempArrow.end.canvasX,
                  tempArrow.end.canvasY,
                ]}
                stroke="#f00"
                strokeWidth={3}
              />
              <Shape
                sceneFunc={(context) => {
                  if (!tempArrow) return;
                  const arrowHead = getArrowHeadPoints(tempArrow);
                  if (!arrowHead) return;
                  context.beginPath();
                  context.moveTo(tempArrow.end.canvasX, tempArrow.end.canvasY);
                  context.lineTo(arrowHead[0].canvasX, arrowHead[0].canvasY);
                  context.lineTo(arrowHead[1].canvasX, arrowHead[1].canvasY);
                  context.strokeStyle = "#f00";
                  context.fillStyle = "#f00";
                  context.closePath();
                  context.stroke();
                  context.fill();
                }}
                stroke="#f00"
                strokeWidth={2}
              />
            </>
          )}

          {"hand-drawn" === activeTool && tempHandDrawnLine && (
            <>
              <Line points={tempHandDrawnLine} stroke="#f00" strokeWidth={3} />
            </>
          )}
        </Layer>
      </Stage>
      <Sidebar changeProp={changeProp} selectedShape={selectedShape} />
    </>
  );
}
