import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '../../types';

interface ConditionalNodeProps {
  data: AgentNode;
}

const ConditionalNode: React.FC<ConditionalNodeProps> = ({ data }) => {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          ?
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-yellow-600 font-medium">Conditional</div>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-white rounded p-2 border">
        {data.condition ? `If: ${data.condition}` : 'Set condition in properties'}
      </div>
      
      <div className="flex justify-between mt-2">
        <Handle type="source" position={Position.Bottom} id="true" className="w-3 h-3 bg-green-500" style={{ left: '25%' }} />
        <span className="text-xs text-green-600 font-medium" style={{ marginLeft: '-10px' }}>TRUE</span>
        <span className="text-xs text-red-600 font-medium" style={{ marginRight: '-10px' }}>FALSE</span>
        <Handle type="source" position={Position.Bottom} id="false" className="w-3 h-3 bg-red-500" style={{ left: '75%' }} />
      </div>
    </div>
  );
};

export default ConditionalNode; 