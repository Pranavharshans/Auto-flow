import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface DataTransformNodeProps {
  data: AgentNode;
}

const DataTransformNode: React.FC<DataTransformNodeProps> = ({ data }) => {
  const getTransformIcon = () => {
    switch (data.transformType) {
      case 'map': return '🗺️';
      case 'filter': return '🔍';
      case 'reduce': return '⬇️';
      case 'sort': return '📶';
      case 'group': return '📊';
      default: return '⚙️';
    }
  };

  return (
    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {getTransformIcon()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-pink-600 font-medium">Transform</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {data.transformType || 'map'} data transformation
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default DataTransformNode; 