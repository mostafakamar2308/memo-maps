export type Node = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "square" | "circle" | "diamond";
  contentType: "text" | "image";
  content: string;
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
