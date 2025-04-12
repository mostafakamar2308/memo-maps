import { Circle, Group, Image, Rect, Text } from "react-konva";
import { Node } from "@/types/Canvas";
import useImage from "use-image";

export function ShapeRenderer({
  node,
  updatePosition,
}: {
  node: Node;
  updatePosition: (newPosition: { x: number; y: number }) => void;
}) {
  const [image] = useImage(
    node.contentType === "image"
      ? "https://konvajs.org/assets/darth-vader.jpg"
      : ""
  );

  const { content, contentType, id, layer, x, y, ...validProps } = node;

  if (node.type === "square")
    return (
      <Group
        draggable={true}
        x={x ?? 0}
        y={y ?? 0}
        onDragStart={(e) => console.log("Drag started", e)}
        onDragMove={(e) => console.log("Dragging", e)}
        onDragEnd={(e) =>
          updatePosition({
            x: e.target.x(),
            y: e.target.y(),
          })
        }
      >
        {node.contentType === "text" && content !== "" && (
          <Text
            fill={node.textColor || "black"}
            text={node.content}
            {...validProps}
            offsetX={-node.width / 2}
            offsetY={-node.height / 2}
          />
        )}
        {node.contentType === "image" && <Image image={image} {...node} />}
        <Rect {...validProps} fill={node.bgColor || "green"} />
      </Group>
    );

  if (node.type === "circle")
    return (
      <Group
        draggable
        x={x ?? 0}
        y={y ?? 0}
        onDragStart={(e) => console.log("Drag started", e)}
        onDragMove={(e) => console.log("Dragging", e)}
        onDragEnd={(e) => console.log("Drag ended", e)}
      >
        {node.contentType === "text" && (
          <Text text={node.content} {...validProps} />
        )}
        {node.contentType === "image" && (
          <Image image={image} {...validProps} />
        )}
        <Circle {...validProps} />
      </Group>
    );

  if (node.type === "diamond")
    return (
      <Group
        draggable
        x={x ?? 0}
        y={y ?? 0}
        onDragStart={(e) => console.log("Drag started", e)}
        onDragMove={(e) => console.log("Dragging", e)}
        onDragEnd={(e) => console.log("Drag ended", e)}
      >
        {node.contentType === "text" && (
          <Text text={node.content} {...validProps} />
        )}
        {node.contentType === "image" && (
          <Image image={image} {...validProps} />
        )}
        <Rect {...validProps} rotation={45} />
      </Group>
    );

  return null;
}
