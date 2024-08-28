import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

interface NodeData {
  label: string;
}

const commonStyles = {
  padding: "10px",
  fontSize: "12px",
  color: "white",
  textAlign: "center" as const,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  width: "150px",
};

const handleStyle = {
  background: "#555",
  width: "8px",
  height: "8px",
  border: "2px solid #fff",
};

const nodeWrapper = {
  background: "transparent",
  border: "none",
};

export const InputNode = memo(({ data }: NodeProps<NodeData>) => (
  <div style={nodeWrapper}>
    <div
      style={{
        ...commonStyles,
        background: "rgba(59, 130, 246, 0.7)",
        borderRadius: "5px 5px 20px 20px",
      }}
    >
      {data.label}
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  </div>
));

export const OutputNode = memo(({ data }: NodeProps<NodeData>) => (
  <div style={nodeWrapper}>
    <div
      style={{
        ...commonStyles,
        background: "rgba(239, 68, 68, 0.7)",
        borderRadius: "20px 20px 5px 5px",
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      {data.label}
    </div>
  </div>
));

export const DefaultNode = memo(({ data }: NodeProps<NodeData>) => (
  <div style={nodeWrapper}>
    <div
      style={{
        ...commonStyles,
        background: "rgba(34, 197, 94, 0.7)",
        borderRadius: "3px",
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  </div>
));

export const DecisionNode = memo(({ data }: NodeProps<NodeData>) => (
  <div style={nodeWrapper}>
    <div
      style={{
        ...commonStyles,
        background: "rgba(234, 179, 8, 0.7)",
        width: "120px",
        height: "120px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(45deg)",
        transformOrigin: "center center",
      }}
    >
      <div style={{ transform: "rotate(-45deg)" }}>{data.label}</div>
      <Handle
        type="target"
        position={Position.Top}
        style={{ ...handleStyle, left: "50%", top: "-5px" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ ...handleStyle, left: "50%", bottom: "-5px" }}
      />
      <Handle
        type="source"
        position={Position.Left}
        style={{ ...handleStyle, left: "-5px", top: "50%" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ ...handleStyle, right: "-5px", top: "50%" }}
      />
    </div>
  </div>
));

export const ProcessNode = memo(({ data }: NodeProps<NodeData>) => (
  <div style={nodeWrapper}>
    <div
      style={{
        ...commonStyles,
        background: "rgba(168, 85, 247, 0.7)",
        width: "200px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
      }}
    >
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Handle type="target" position={Position.Left} style={handleStyle} />
      {data.label}
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  </div>
));
