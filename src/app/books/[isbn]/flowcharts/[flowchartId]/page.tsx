"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save, Undo, Redo } from "lucide-react";
import { api } from "~/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import Sidebar from "~/app/_components/books/flowchart/sidebar";
import {
  InputNode,
  OutputNode,
  DefaultNode,
  DecisionNode,
  ProcessNode,
} from "~/app/_components/books/flowchart/custom-node-types";
import type { ReactFlowInstance } from "reactflow";

const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  default: DefaultNode,
  decision: DecisionNode,
  process: ProcessNode,
};

type FlowchartContent = {
  nodes: Node[];
  edges: Edge[];
};

type Flowchart = {
  id: string;
  title: string;
  content: string;
};

type HistoryEntry = {
  nodes: Node[];
  edges: Edge[];
};

const FlowchartEditPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [title, setTitle] = useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const router = useRouter();
  const params = useParams();
  const { isbn, flowchartId } = params;
  const { toast } = useToast();

  const { data: flowchart, isLoading } = api.flowchart.getById.useQuery({
    id: flowchartId as string,
  });

  const updateFlowchartMutation = api.flowchart.update.useMutation({
    onSuccess: () => {
      toast({
        title: "フローチャート更新成功",
        description: "フローチャートが更新されました。",
      });
    },
    onError: (error) => {
      toast({
        title: "エラー",
        description: "フローチャートの更新に失敗しました。",
        variant: "destructive",
      });
      console.error("Error updating flowchart:", error);
    },
  });

  useEffect(() => {
    if (flowchart) {
      setTitle(flowchart.title);
      try {
        const content: FlowchartContent = JSON.parse(flowchart.content);
        setNodes(content.nodes || []);
        setEdges(content.edges || []);
        setHistory([
          { nodes: content.nodes || [], edges: content.edges || [] },
        ]);
        setHistoryIndex(0);
      } catch (error) {
        console.error("Error parsing flowchart content:", error);
        toast({
          title: "エラー",
          description: "フローチャートのデータを読み込めませんでした。",
          variant: "destructive",
        });
      }
    }
  }, [flowchart, setEdges, setNodes, toast]);

  const addToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      setHistory((hist) => {
        const newHistory = hist.slice(0, historyIndex + 1);
        newHistory.push({ nodes: newNodes, edges: newEdges });
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
    },
    [historyIndex],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        addToHistory(nodes, newEdges);
        return newEdges;
      });
    },
    [nodes, setEdges, addToHistory],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowInstance && reactFlowWrapper.current) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });
        const newNode: Node = {
          id: `${type}-${nodes.length + 1}`,
          type,
          position,
          data: { label: `${type} node` },
        };

        setNodes((nds) => {
          const newNodes = nds.concat(newNode);
          addToHistory(newNodes, edges);
          return newNodes;
        });
      }
    },
    [reactFlowInstance, nodes, edges, setNodes, addToHistory],
  );

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "エラー",
        description: "タイトルを入力してください。",
        variant: "destructive",
      });
      return;
    }
    const flowchartData = {
      nodes,
      edges,
    };
    updateFlowchartMutation.mutate({
      id: flowchartId as string,
      title,
      content: JSON.stringify(flowchartData),
    });
  };

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const newLabel = prompt("Enter new label:", node.data.label);
      if (newLabel !== null) {
        setNodes((nds) => {
          const updatedNodes = nds.map((n) =>
            n.id === node.id
              ? { ...n, data: { ...n.data, label: newLabel } }
              : n,
          );
          addToHistory(updatedNodes, edges);
          return updatedNodes;
        });
      }
    },
    [setNodes, edges, addToHistory],
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((index) => {
        const newIndex = index - 1;
        const historyEntry = history[newIndex];
        if (historyEntry) {
          const { nodes: prevNodes, edges: prevEdges } = historyEntry;
          setNodes(prevNodes);
          setEdges(prevEdges);
        }
        return newIndex;
      });
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((index) => {
        const newIndex = index + 1;
        const historyEntry = history[newIndex];
        if (historyEntry) {
          const { nodes: nextNodes, edges: nextEdges } = historyEntry;
          setNodes(nextNodes);
          setEdges(nextEdges);
        }
        return newIndex;
      });
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        redo();
      }
    },
    [undo, redo],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full mx-auto bg-gray-800 text-gray-100 shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-300">
            フローチャート編集
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="title" className="text-gray-300">
              タイトル
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
          <div className="flex h-[600px]">
            <Sidebar />
            <div className="flex-grow" ref={reactFlowWrapper}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
              >
                <Controls />
                <MiniMap />
                <Background color="#aaa" gap={16} />
                <Panel position="top-right">
                  <Button
                    onClick={undo}
                    className="bg-gray-600 text-white hover:bg-gray-700 mr-2"
                  >
                    <Undo className="mr-2 h-4 w-4" />
                    元に戻す (Ctrl+Z)
                  </Button>
                  <Button
                    onClick={redo}
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    <Redo className="mr-2 h-4 w-4" />
                    やり直す (Ctrl+Y)
                  </Button>
                </Panel>
              </ReactFlow>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              onClick={() => router.push(`/books/${isbn}`)}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              戻る
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowchartEditPage;
