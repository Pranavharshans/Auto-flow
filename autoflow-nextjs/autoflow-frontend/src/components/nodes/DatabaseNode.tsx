import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface DatabaseNodeProps {
  data: AgentNode;
}

const DatabaseNode: React.FC<DatabaseNodeProps> = ({ data }) => {
  const getDbIcon = () => {
    switch (data.dbType) {
      case 'mysql': return '🐬';
      case 'postgres': return '🐘';
      case 'mongodb': return '🍃';
      case 'sqlite': return '📦';
      default: return '🗄️';
    }
  };

  return (
    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {getDbIcon()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-orange-600 font-medium">Database</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {data.dbOperation || 'select'} • {data.dbType || 'mysql'}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default DatabaseNode; 