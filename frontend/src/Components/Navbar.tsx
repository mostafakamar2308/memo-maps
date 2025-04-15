import { Tool } from "@/types/Canvas";
import cn from "classnames";

export function NavBar({
  activeTool,
  changeTool,
}: {
  activeTool: Tool;
  changeTool: (tool: Tool) => void;
}) {
  return (
    <div className="absolute bg-white p-2 px-4 rounded-2xl shadow-md top-4 left-1/2 -translate-x-1/2 flex gap-8">
      <button
        onClick={() => changeTool("select")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "select" && "bg-[#eee]"
        )}
      >
        select
      </button>
      <button
        onClick={() => changeTool("eclipse")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "eclipse" && "bg-[#eee]"
        )}
      >
        eclipse
      </button>
      <button
        onClick={() => changeTool("square")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "square" && "bg-[#eee]"
        )}
      >
        square
      </button>
      <button
        onClick={() => changeTool("diamond")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "diamond" && "bg-[#eee]"
        )}
      >
        diamond
      </button>
      <button
        onClick={() => changeTool("line")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "line" && "bg-[#eee]"
        )}
      >
        line
      </button>
      <button
        onClick={() => changeTool("arrow")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "arrow" && "bg-[#eee]"
        )}
      >
        arrow
      </button>
      <button
        onClick={() => changeTool("eraser")}
        className={cn(
          "duration-300 p-2 px-3 rounded-xl hover:bg-[#eee] cursor-pointer",
          activeTool === "eraser" && "bg-[#eee]"
        )}
      >
        eraser
      </button>
    </div>
  );
}
