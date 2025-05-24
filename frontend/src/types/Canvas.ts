export type Node = {
  id: string;
  canvasX: number;
  canvasY: number;
  absoluteX?: number;
  absoluteY?: number;
  width: number;
  height: number;
  type: NodeType;
  contentType: "text" | "image";
  content: string;
  points?: number[];
  closed?: boolean;
  layer: number;
  borderSize?: number;
  borderColor?: string;
  borderRadius?: number;
  roughness?: number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  children?: number[];
  parents?: number[];
};

export type NodeType =
  | "square"
  | "circle"
  | "diamond"
  | "line"
  | "hand-drawn"
  | "text"
  | "custom";

export type Map = {
  nodes: Node[];
};

export type Tool =
  | "select"
  | "square"
  | "diamond"
  | "eraser"
  | "line"
  | "hand-drawn"
  | "text"
  | "eclipse"
  | "arrow";
