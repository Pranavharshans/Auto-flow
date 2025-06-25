'use client';

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

import { useWorkflowStore } from '@/stores/workflowStore';
import { AgentNode } from '@/types';
import LLMAgentNode from './nodes/LLMAgentNode';
import SequentialWorkflowNode from './nodes/SequentialWorkflowNode';
import ParallelWorkflowNode from './nodes/ParallelWorkflowNode';
import ConditionalNode from './nodes/ConditionalNode';
import LoopNode from './nodes/LoopNode';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import ApiCallNode from './nodes/ApiCallNode';
import DatabaseNode from './nodes/DatabaseNode';
import FileOperationsNode from './nodes/FileOperationsNode';
import DataTransformNode from './nodes/DataTransformNode';
import ValidatorNode from './nodes/ValidatorNode';
import RouterNode from './nodes/RouterNode';
import DelayNode from './nodes/DelayNode';
import DebugNode from './nodes/DebugNode';
import VariableNode from './nodes/VariableNode';

const nodeTypes = {
  'llm-agent': LLMAgentNode,
  'sequential-workflow': SequentialWorkflowNode,
  'parallel-workflow': ParallelWorkflowNode,
  'conditional': ConditionalNode,
  'loop': LoopNode,
  'input': InputNode,
  'output': OutputNode,
  'api-call': ApiCallNode,
  'database': DatabaseNode,
  'file-operations': FileOperationsNode,
  'data-transform': DataTransformNode,
  'validator': ValidatorNode,
  'router': RouterNode,
  'delay': DelayNode,
  'debug': DebugNode,
  'variable': VariableNode,
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

      const getNodeDefaults = (nodeType: string) => {
        switch (nodeType) {
          case 'llm-agent':
            return {
              name: 'New Agent',
              instruction: 'Enter your agent instruction here...',
              model: 'gemini-2.0-flash-exp',
            };
          case 'sequential-workflow':
            return {
              name: 'Sequential Workflow',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
            };
          case 'parallel-workflow':
            return {
              name: 'Parallel Workflow',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
            };
          case 'conditional':
            return {
              name: 'Conditional',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              condition: '',
              conditionType: 'equals' as const,
            };
          case 'loop':
            return {
              name: 'Loop',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              loopType: 'fixed-count' as const,
              loopCount: 1,
            };
          case 'input':
            return {
              name: 'Input',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              inputType: 'text' as const,
              placeholder: 'Enter input...',
            };
          case 'output':
            return {
              name: 'Output',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              outputFormat: 'text' as const,
            };
          case 'api-call':
            return {
              name: 'API Call',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              apiMethod: 'GET' as const,
              apiUrl: '',
            };
          case 'database':
            return {
              name: 'Database',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              dbType: 'mysql' as const,
              dbOperation: 'select' as const,
            };
          case 'file-operations':
            return {
              name: 'File Operations',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              fileOperation: 'read' as const,
              fileFormat: 'txt' as const,
            };
          case 'data-transform':
            return {
              name: 'Data Transform',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              transformType: 'map' as const,
            };
          case 'validator':
            return {
              name: 'Validator',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              validationType: 'required' as const,
            };
          case 'router':
            return {
              name: 'Router',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              routingRules: [],
            };
          case 'delay':
            return {
              name: 'Delay',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              delayAmount: 1,
              delayUnit: 'seconds' as const,
            };
          case 'debug':
            return {
              name: 'Debug',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
            };
          case 'variable':
            return {
              name: 'Variable',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
              variableName: 'variable',
              variableType: 'string' as const,
            };
          default:
            return {
              name: 'New Node',
              instruction: '',
              model: 'gemini-2.0-flash-exp',
            };
        }
      };

      const defaults = getNodeDefaults(type);
      const newNode: AgentNode = {
        id: `${type}-${Date.now()}`,
        type: type as AgentNode['type'],
        position,
        ...defaults,
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