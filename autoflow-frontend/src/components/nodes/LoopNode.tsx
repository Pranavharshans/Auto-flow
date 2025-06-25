import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface LoopNodeProps {
  data: AgentNode;
}

const LoopNode: React.FC<LoopNodeProps> = ({ data }) => {
  const getLoopDisplay = () => {
    switch (data.loopType) {
      case 'for-each':
        return 'For Each Item';
      case 'while':
        return `While: ${data.loopCondition || 'condition'}`;
      case 'fixed-count':
        return `Repeat ${data.loopCount || 1}x`;
      default:
        return 'Configure loop';
    }
  };

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
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {getLoopDisplay()}
      </div>
      
      <div className="flex gap-1 mt-2">
        <Handle type="source" position={Position.Bottom} id="loop" className="w-3 h-3 bg-purple-500" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="exit" className="w-3 h-3 bg-gray-500" style={{ left: '70%' }} />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>LOOP</span>
        <span>EXIT</span>
      </div>
    </div>
  );
};

export default LoopNode; 