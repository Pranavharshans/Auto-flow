import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface InputNodeProps {
  data: AgentNode;
}

const InputNode: React.FC<InputNodeProps> = ({ data }) => {
  const getInputIcon = () => {
    switch (data.inputType) {
      case 'text': return '📝';
      case 'number': return '🔢';
      case 'file': return '📁';
      case 'json': return '🗂️';
      default: return '📝';
    }
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {getInputIcon()}
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-blue-600 font-medium">Input</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {data.placeholder || `Enter ${data.inputType || 'text'} input`}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default InputNode; 