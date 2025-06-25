import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface DebugNodeProps {
  data: AgentNode;
}

const DebugNode: React.FC<DebugNodeProps> = ({ data }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          🐛
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-red-600 font-medium">Debug</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        Log and inspect data
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default DebugNode; 