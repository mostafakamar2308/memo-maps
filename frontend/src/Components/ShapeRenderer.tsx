import { Group, Image, Rect, Text, Ellipse, Shape } from "react-konva";
import { Node } from "@/types/Canvas";
import useImage from "use-image";

export function ShapeRenderer({ node }: { node: Node }) {
  const [image] = useImage(
    node.contentType === "image"
      ? "https://konvajs.org/assets/darth-vader.jpg"
      : ""
  );

  const { content, x, y, ...validProps } = node;

  if (node.type === "square")
    return (
      <Group draggable={true} x={x ?? 0} y={y ?? 0}>
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
      <Group draggable x={x ?? 0} y={y ?? 0}>
        {node.contentType === "text" && (
          <Text text={node.content} {...validProps} />
        )}
        {node.contentType === "image" && (
          <Image image={image} {...validProps} />
        )}
        <Ellipse
          {...validProps}
          fill={node.bgColor || "green"}
          radiusX={node.width}
          radiusY={node.height}
        />
      </Group>
    );

  if (node.type === "diamond") {
    const points = node.points || [];
    const xs = points.filter((_, i) => i % 2 === 0); // Extract x-coordinates
    const ys = points.filter((_, i) => i % 2 !== 0); // Extract y-coordinates

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    return (
      <Group width={width} height={height} draggable x={x ?? 0} y={y ?? 0}>
        {node.contentType === "text" && (
          <Text text={node.content} {...validProps} />
        )}
        {node.contentType === "image" && (
          <Image image={image} {...validProps} />
        )}
        <Rect
          x={minX}
          y={minY}
          width={width}
          height={height}
          stroke="transparent"
          strokeWidth={1}
        />
        <Shape
          key={node.id}
          sceneFunc={(context) => {
            if (!node.points) return;
            if (node.bgColor) context.fillStyle = node.bgColor;
            if (node.borderColor) context.strokeStyle = node.borderColor;
            context.beginPath();
            context.moveTo(node.points[0], node.points[1]);
            for (let i = 2; i < node.points.length; i += 2) {
              context.lineTo(node.points[i], node.points[i + 1]);
            }
            context.closePath();
            context.stroke();
            context.fill();
          }}
          hitFunc={(context) => {
            if (!node.points) return;

            // Define the same path for hit detection
            context.beginPath();
            context.moveTo(node.points[0], node.points[1]);
            for (let i = 2; i < node.points.length; i += 2) {
              context.lineTo(node.points[i], node.points[i + 1]);
            }
            context.closePath();
            if (node.bgColor) context.fillStyle = node.bgColor;
            if (node.borderColor) context.strokeStyle = node.borderColor;
            context.fill();
            context.stroke();
          }}
          fill={node.bgColor}
          strokeWidth={2}
        />
      </Group>
    );
  }

  return null;
}
