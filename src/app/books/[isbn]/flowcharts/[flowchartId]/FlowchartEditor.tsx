"use client";

import { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  type Connection,
  type Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FlowchartEditorProps {
  flowchartId: string;
}

const FlowchartEditor: React.FC<FlowchartEditorProps> = ({ flowchartId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  const { data: flowchart, isLoading } = api.flowchart.getById.useQuery(
    { id: flowchartId },
    { enabled: !!flowchartId },
  );

  const updateFlowchartMutation = api.flowchart.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Flowchart updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update flowchart: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (flowchart) {
      setTitle(flowchart.title);
      const content = JSON.parse(flowchart.content);
      setNodes(content.nodes);
      setEdges(content.edges);
    }
  }, [flowchart, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleSave = useCallback(() => {
    if (!flowchartId) {
      toast({
        title: "Error",
        description: "Flowchart ID is missing",
        variant: "destructive",
      });
      return;
    }

    updateFlowchartMutation.mutate({
      id: flowchartId,
      title,
      content: JSON.stringify({ nodes, edges }),
    });
  }, [flowchartId, title, nodes, edges, updateFlowchartMutation, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        className="h-full w-full"
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="absolute left-4 top-4 z-10 flex items-center space-x-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Flowchart Title"
          className="w-64 bg-white/90 text-black placeholder-gray-400"
        />
        <Button
          onClick={handleSave}
          disabled={updateFlowchartMutation.isPending}
          className="bg-white/90 text-black hover:bg-white"
        >
          <Save className="mr-2 h-4 w-4" />
          {updateFlowchartMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default FlowchartEditor;
