import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, Transformer } from "react-konva";
import Konva from "konva";
import { Html } from "react-konva-utils";
import { Node } from "@/types/Canvas";

// Measure text width in logical coordinates
const measureTextWidth = (text: string, fontSize: number, padding: number) => {
  const tempText = new Konva.Text({
    text,
    fontSize,
    padding,
  });
  tempText.cache();
  const width = tempText.width();
  tempText.destroy();
  return width;
};

const measureTextHeight = (text: string, fontSize: number, padding: number) => {
  const tempText = new Konva.Text({
    text,
    fontSize,
    padding,
  });
  tempText.cache();
  const height = tempText.height();
  tempText.destroy();
  return height;
};

function getStyle(fontSize: number) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    colour: "black",
    fontSize: `${fontSize}px`,
    fontFamily: "sans-serif",
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: "-4px",
  };
}

const TextArea: React.FC<{
  x?: number;
  y?: number;
  fontSize: number;
  value: string;
  onBlur?: (text: string) => void;
}> = ({ x, y, fontSize, value, onBlur }) => {
  const [text, setText] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const style = useMemo(() => getStyle(fontSize), [fontSize]);

  const width = useMemo(
    () => measureTextWidth(text, fontSize, 5),
    [text, fontSize]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "5px";
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 20
      }px`;
    }
  });

  return (
    <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
      <textarea
        onBlur={() => onBlur && onBlur(text)}
        autoFocus
        className="resize-none min-w-fit"
        value={text}
        ref={textareaRef}
        onChange={handleChange}
        style={{
          ...style,
          width: width + "px",
        }}
      />
    </Html>
  );
};

const EditableText: React.FC<{
  node: Node;
  isSelected?: boolean;
  onChange: (id: string, newText: string) => void;
  onSelect: (id: string) => void;
  stage: Konva.Stage | null;
}> = ({ node, onChange, onSelect, isSelected, stage }) => {
  const [textWidth, setTextWidth] = useState<number>(
    measureTextWidth(node.content || "", node.fontSize || 16, 5)
  );
  const [textHeight, setTextHeight] = useState<number>(
    measureTextHeight(node.content || "", node.fontSize || 16, 5)
  );
  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!textRef.current) return;
    const textNode = textRef.current;
    const newWidth = measureTextWidth(
      node.content || "",
      node.fontSize || 16,
      textNode.padding() || 0
    );
    const newHeight = measureTextHeight(
      node.content || "",
      node.fontSize || 16,
      textNode.padding() || 0
    );
    textNode.setAttrs({ width: newWidth, height: newHeight });
    setTextHeight(newHeight);
    setTextWidth(newWidth);
  }, [node.content, node.fontSize]);

  const handleTextDblClick = useCallback(
    (e: Konva.KonvaEventObject<MouseEvent>) => {
      e.evt.stopPropagation(); // Prevent transformer from activating
      setIsEditing(true);
    },
    []
  );

  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      // Sync transformer with text node position
      trRef.current.position({
        x: textRef.current.x(),
        y: textRef.current.y(),
      });
    }
  }, [isSelected]);

  const stageX = useMemo(() => stage?.scaleX(), [stage]);
  const stageY = useMemo(() => stage?.scaleY(), [stage]);

  // Update transformer on stage changes
  useEffect(() => {
    if (trRef.current && textRef.current) {
      trRef.current.getLayer()?.batchDraw();
    }
  }, [stageX, stageY]);

  if (isEditing)
    return (
      <TextArea
        fontSize={node.fontSize || 16}
        onBlur={(text) => {
          setIsEditing(false);
          onChange(node.id, text);
        }}
        value={node.content}
        x={node.absoluteX}
        y={node.absoluteY}
      />
    );

  return (
    <>
      <Text
        ref={textRef}
        text={node.content || " "}
        x={node.canvasX}
        y={node.canvasY}
        fontSize={node.fontSize}
        fill={node.textColor}
        width={textWidth}
        height={textHeight}
        padding={5}
        draggable
        onDblClick={handleTextDblClick}
        onTransform={() => {
          const node = textRef.current;
          if (!node) return;
          setTextWidth(node.width() * node.scaleX());
          setTextHeight(node.height() * node.scaleY());
          node.scaleX(1);
          node.scaleY(1);
        }}
        onClick={() => {
          onSelect(node.id);
          setIsEditing(false); // Ensure editing is off when selecting
        }}
        visible={!isEditing}
        align="center"
        verticalAlign="middle"
      />

      {isSelected && !isEditing && stage && (
        <Transformer
          ref={trRef}
          enabledAnchors={[
            "middle-left",
            "top-center",
            "bottom-center",
            "middle-right",
          ]}
          boundBoxFunc={(_, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
          onTransformEnd={() => {
            const textNode = textRef.current;
            if (!textNode) return;
            const newWidth = textNode.width();
            setTextWidth(newWidth);
            onChange(node.id, textNode.text());
          }}
        />
      )}
    </>
  );
};

export default EditableText;
