import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface ParallelWorkflowNodeProps {
  data: AgentNode;
}

const ParallelWorkflowNode: React.FC<ParallelWorkflowNodeProps> = ({ data }) => {
  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          ⚡
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-green-600 font-medium">Parallel</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        Execute simultaneously
      </div>
      
      <div className="flex justify-around mt-2">
        <Handle type="source" position={Position.Bottom} id="out1" className="w-3 h-3" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="out2" className="w-3 h-3" style={{ left: '70%' }} />
      </div>
    </div>
  );
};

export default ParallelWorkflowNode; 