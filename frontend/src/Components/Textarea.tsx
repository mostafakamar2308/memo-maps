import { useRef } from "react";

export function Textarea({
  clientX,
  clientY,
  onChange,
  nodeId,
  onBlur,
}: {
  clientX: number;
  clientY: number;
  nodeId: string;
  onChange: (payload: {
    nodeId: string;
    text: string;
    width: number;
    height: number;
  }) => void;
  onBlur: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Function to adjust the height of the textarea
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to recalculate the scrollHeight
      textarea.style.height = "auto";
      // Set the height to match the scrollHeight
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        left: clientX,
        top: clientY,
        zIndex: 1000,
      }}
    >
      <textarea
        ref={textareaRef}
        className="min-h-fit resize-none outline-none"
        onChange={adjustHeight}
        onBlur={(e) => {
          const { width, height } = e.target.getBoundingClientRect();
          onBlur();
          onChange({ nodeId: nodeId, text: e.target.value, width, height });
        }}
        autoFocus
        style={{ width: 200 }}
      />
    </div>
  );
}
