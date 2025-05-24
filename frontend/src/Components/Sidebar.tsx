import { Node } from "@/types/Canvas";

export const Sidebar: React.FC<{
  changeProp: <K extends keyof Node>(
    prop: K,
    value: Node[K],
    id: string
  ) => void;
  selectedShape: Node["id"] | null;
}> = ({ changeProp, selectedShape }) => {
  if (!selectedShape) return null;

  return (
    <div className="fixed left-3 p-2 rounded-xl top-1/2 -translate-y-1/2 w-60 h-2/3 border bg-red-50 border-red-300">
      <div>
        <h3>bg Color</h3>
        <div className="flex justify-around [&>*]:border">
          <button
            onClick={() => changeProp("bgColor", "red", selectedShape)}
            className="bg-red-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("bgColor", "green", selectedShape)}
            className="bg-green-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("bgColor", "black", selectedShape)}
            className="bg-black w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("bgColor", "white", selectedShape)}
            className="bg-white w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("bgColor", "blue", selectedShape)}
            className="bg-blue-700 w-5 h-5 rounded"
          />
        </div>
      </div>
      <div>
        <h3>border Color</h3>
        <div className="flex justify-around [&>*]:border">
          <button
            onClick={() => changeProp("borderColor", "red", selectedShape)}
            className="bg-red-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("borderColor", "green", selectedShape)}
            className="bg-green-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("borderColor", "black", selectedShape)}
            className="bg-black w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("borderColor", "white", selectedShape)}
            className="bg-white w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("borderColor", "blue", selectedShape)}
            className="bg-blue-700 w-5 h-5 rounded"
          />
        </div>
      </div>
      <div>
        <h3>Text Color</h3>
        <div className="flex justify-around [&>*]:border">
          <button
            onClick={() => changeProp("textColor", "red", selectedShape)}
            className="bg-red-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("textColor", "green", selectedShape)}
            className="bg-green-700 w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("textColor", "black", selectedShape)}
            className="bg-black w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("textColor", "white", selectedShape)}
            className="bg-white w-5 h-5 rounded"
          />
          <button
            onClick={() => changeProp("textColor", "blue", selectedShape)}
            className="bg-blue-700 w-5 h-5 rounded"
          />
        </div>
      </div>
      <div>
        <h3>Font Size</h3>
        <div className="flex justify-around [&>*]:border">
          <button
            onClick={() => changeProp("fontSize", 16, selectedShape)}
            className="bg-red-700 w-5 h-5 rounded"
          >
            SM
          </button>
          <button
            onClick={() => changeProp("fontSize", 20, selectedShape)}
            className="bg-green-700 w-5 h-5 rounded"
          >
            LG
          </button>
          <button
            onClick={() => changeProp("fontSize", 24, selectedShape)}
            className="bg-black w-5 h-5 rounded"
          >
            XL
          </button>
          <button
            onClick={() => changeProp("fontSize", 32, selectedShape)}
            className="bg-white w-5 h-5 rounded"
          >
            2XL
          </button>
          <button
            onClick={() => changeProp("fontSize", 40, selectedShape)}
            className="bg-blue-700 w-5 h-5 rounded"
          >
            3XL
          </button>
        </div>
      </div>
    </div>
  );
};
