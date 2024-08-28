import type React from "react";
import { Square, Circle, Diamond, Hexagon } from "lucide-react";

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="p-4 bg-gray-900 text-white w-64">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">ノードタイプ</h3>
        <div
          className="p-2 mb-2 bg-blue-600 rounded cursor-move flex items-center"
          onDragStart={(event) => onDragStart(event, "input")}
          draggable
        >
          <Square className="mr-2" /> 入力ノード
        </div>
        <div
          className="p-2 mb-2 bg-green-600 rounded cursor-move flex items-center"
          onDragStart={(event) => onDragStart(event, "default")}
          draggable
        >
          <Circle className="mr-2" /> デフォルトノード
        </div>
        <div
          className="p-2 mb-2 bg-red-600 rounded cursor-move flex items-center"
          onDragStart={(event) => onDragStart(event, "output")}
          draggable
        >
          <Diamond className="mr-2" /> 出力ノード
        </div>
        <div
          className="p-2 mb-2 bg-yellow-600 rounded cursor-move flex items-center"
          onDragStart={(event) => onDragStart(event, "decision")}
          draggable
        >
          <Diamond className="mr-2" /> 判断ノード
        </div>
        <div
          className="p-2 mb-2 bg-purple-600 rounded cursor-move flex items-center"
          onDragStart={(event) => onDragStart(event, "process")}
          draggable
        >
          <Hexagon className="mr-2" /> プロセスノード
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;