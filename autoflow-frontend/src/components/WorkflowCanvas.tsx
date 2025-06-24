import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from '../stores/workflowStore';
import { AgentNode } from '../types';
import LLMAgentNode from './nodes/LLMAgentNode';
import SequentialWorkflowNode from './nodes/SequentialWorkflowNode';

const nodeTypes = {
  'llm-agent': LLMAgentNode,
  'sequential-workflow': SequentialWorkflowNode,
};

const WorkflowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  
  const { 
    nodes, 
    edges, 
    addNode, 
    addEdge: addStoreEdge, 
    setSelectedNode 
  } = useWorkflowStore();

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] = useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] = useEdgesState([]);

  // Sync store nodes with ReactFlow nodes
  React.useEffect(() => {
    const rfNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node,
    }));
    setReactFlowNodes(rfNodes);
  }, [nodes, setReactFlowNodes]);

  // Sync store edges with ReactFlow edges
  React.useEffect(() => {
    const rfEdges = edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }));
    setReactFlowEdges(rfEdges);
  }, [edges, setReactFlowEdges]);

  const onConnect = useCallback((params: Connection) => {
    const newEdge = {
      id: `edge-${params.source}-${params.target}`,
      source: params.source!,
      target: params.target!,
      sourceHandle: params.sourceHandle,
      targetHandle: params.targetHandle,
    };
    addStoreEdge(newEdge);
  }, [addStoreEdge]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node.data);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: AgentNode = {
        id: `${type}-${Date.now()}`,
        type: type as 'llm-agent' | 'sequential-workflow',
        name: type === 'llm-agent' ? 'New Agent' : 'Sequential Workflow',
        instruction: type === 'llm-agent' ? 'Enter your agent instruction here...' : '',
        model: 'gemini-2.0-flash-exp',
        position,
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

const WorkflowCanvasWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <WorkflowCanvas />
  </ReactFlowProvider>
);

export default WorkflowCanvasWithProvider; 