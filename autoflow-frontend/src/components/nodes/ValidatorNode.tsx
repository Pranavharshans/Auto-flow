import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface ValidatorNodeProps {
  data: AgentNode;
}

const ValidatorNode: React.FC<ValidatorNodeProps> = ({ data }) => {
  return (
    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          ✅
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-emerald-600 font-medium">Validator</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {data.validationType || 'required'} validation
      </div>
      
      <div className="flex gap-1 mt-2">
        <Handle type="source" position={Position.Bottom} id="valid" className="w-3 h-3 bg-green-500" style={{ left: '30%' }} />
        <Handle type="source" position={Position.Bottom} id="invalid" className="w-3 h-3 bg-red-500" style={{ left: '70%' }} />
      </div>
    </div>
  );
};

export default ValidatorNode; 