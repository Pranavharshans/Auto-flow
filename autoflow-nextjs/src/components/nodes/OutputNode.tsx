import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface OutputNodeProps {
  data: AgentNode;
}

const OutputNode: React.FC<OutputNodeProps> = ({ data }) => {
  return (
    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          📄
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-indigo-600 font-medium">Output</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-gray-600">
          Format: {data.outputFormat || 'text'}
        </div>
        <div className="text-xs text-gray-500">
          Display results
        </div>
      </div>
    </div>
  );
};

export default OutputNode; 