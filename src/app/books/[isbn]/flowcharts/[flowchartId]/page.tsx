import FlowchartEditor from "./FlowchartEditor";

interface PageProps {
  params: {
    flowchartId: string;
  };
}

export default function FlowchartPage({ params }: PageProps) {
  return <FlowchartEditor flowchartId={params.flowchartId} />;
}