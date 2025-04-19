export type Node = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "square" | "circle" | "diamond" | "line" | "hand-drawn" | "custom";
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
  | "eclipse"
  | "arrow";
