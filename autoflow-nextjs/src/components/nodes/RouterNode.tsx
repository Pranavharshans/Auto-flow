import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface RouterNodeProps {
  data: AgentNode;
}

const RouterNode: React.FC<RouterNodeProps> = ({ data }) => {
  const routeCount = data.routingRules?.length || 2;
  
  return (
    <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          🧭
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-violet-600 font-medium">Router</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        Routes: {routeCount}
      </div>
      
      <div className="flex justify-around mt-2">
        {Array.from({ length: Math.min(routeCount, 3) }, (_, i) => (
          <Handle
            key={i}
            type="source"
            position={Position.Bottom}
            id={`route${i}`}
            className="w-3 h-3"
            style={{ left: `${25 + i * 25}%` }}
          />
        ))}
      </div>
    </div>
  );
};

export default RouterNode; 