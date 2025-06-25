import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { AgentNode } from '../../types';

const SequentialWorkflowNode: React.FC<NodeProps<AgentNode>> = ({ data, selected }) => {
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
      selected ? 'border-green-500' : 'border-gray-200'
    }`}>
      <Handle type="target" position={Position.Top} />
      
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-xl">📋</span>
        <div className="font-medium text-gray-900">{data.name}</div>
      </div>
      
      <div className="text-xs text-gray-500 mb-2">Sequential Workflow</div>
      
      <div className="text-sm text-gray-600">
        Container for multiple agents in sequence
      </div>
      
      <div className="mt-2 text-xs text-green-600 font-medium">
        Chain Execution
      </div>
      
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default SequentialWorkflowNode; 