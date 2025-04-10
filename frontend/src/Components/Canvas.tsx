import { Layer, Stage } from "react-konva";
import { ShapeRenderer } from "@/utils/shapeRenderer";
import { useState } from "react";

export function StageCanvas() {
  const [position, setPosition] = useState({ x: 500, y: 158 });
  console.log({ position });

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <ShapeRenderer
          node={{
            type: "square",
            content: "",
            contentType: "text",
            ...position,
            width: 100,
            height: 100,
            id: "1",
            layer: 0,
            borderSize: 2,
            borderColor: "#ff0000",
            borderRadius: 10,
            bgColor: "#f00",
            textColor: "ff0000",
            fontSize: 20,
          }}
          updatePosition={(newPosition: { x: number; y: number }) => {
            console.log("Updating position", newPosition);

            setPosition(newPosition);
          }}
        />
      </Layer>
    </Stage>
  );
}
