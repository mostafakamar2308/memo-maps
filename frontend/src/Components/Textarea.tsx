import { useRef } from "react";

export function Textarea({
  clientX,
  clientY,
  onChange,
  nodeId,
  onBlur,
  content,
}: {
  clientX: number;
  clientY: number;
  nodeId: string;
  content: string;
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
        defaultValue={content}
        className="min-h-fit resize-none outline-none opacity-0"
        onChange={(e) => {
          adjustHeight();
          const { width, height } = e.target.getBoundingClientRect();
          onChange({ nodeId: nodeId, text: e.target.value, width, height });
        }}
        onBlur={onBlur}
        autoFocus
        style={{ width: 200 }}
      />
    </div>
  );
}
