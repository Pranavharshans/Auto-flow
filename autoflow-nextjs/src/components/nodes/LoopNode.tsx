import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface LoopNodeProps {
  data: AgentNode;
}

const LoopNode: React.FC<LoopNodeProps> = ({ data }) => {
  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          🔄
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-purple-600 font-medium">Loop</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-gray-600">
          Type: {data.loopType || 'fixed-count'}
        </div>
        {data.loopType === 'fixed-count' && (
          <div className="text-xs text-gray-600">
            Count: {data.loopCount || 1}
          </div>
        )}
        {data.loopType === 'while' && (
          <div className="text-xs text-gray-600 bg-white rounded p-1 border">
            {data.loopCondition || 'Set condition'}
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-2">
        <Handle type="source" position={Position.Bottom} id="loop" className="w-3 h-3" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="exit" className="w-3 h-3" style={{ left: '70%' }} />
      </div>
    </div>
  );
};

export default LoopNode; 