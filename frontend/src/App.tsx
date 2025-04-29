import "./App.css";
import { StageCanvas } from "@/Components/Canvas";
import { NavBar } from "@/Components/Navbar";
import { useCallback, useState } from "react";
import { Tool } from "@/types/Canvas";

function App() {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  const changeTool = useCallback((tool: Tool) => setActiveTool(tool), []);

  return (
    <main className="relative">
      <StageCanvas changeActiveTool={changeTool} activeTool={activeTool} />
      <NavBar activeTool={activeTool} changeTool={changeTool} />
    </main>
  );
}

export default App;
