import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface ApiCallNodeProps {
  data: AgentNode;
}

const ApiCallNode: React.FC<ApiCallNodeProps> = ({ data }) => {
  const getMethodColor = () => {
    switch (data.apiMethod) {
      case 'GET': return 'bg-green-500';
      case 'POST': return 'bg-blue-500';
      case 'PUT': return 'bg-orange-500';
      case 'DELETE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          🌐
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-teal-600 font-medium">API Call</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className={`text-xs text-white px-2 py-1 rounded ${getMethodColor()}`}>
            {data.apiMethod || 'GET'}
          </span>
          <span className="text-xs text-gray-600 truncate">
            {data.apiUrl || 'Configure URL'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-1 mt-2">
        <Handle type="source" position={Position.Bottom} id="success" className="w-3 h-3 bg-green-500" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="error" className="w-3 h-3 bg-red-500" style={{ left: '70%' }} />
      </div>
    </div>
  );
};

export default ApiCallNode; 