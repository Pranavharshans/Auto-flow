import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface SequentialWorkflowNodeProps {
  data: AgentNode;
}

const SequentialWorkflowNode: React.FC<SequentialWorkflowNodeProps> = ({ data }) => {
  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          📋
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-purple-600 font-medium">Sequential</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        Execute steps in order
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default SequentialWorkflowNode; 