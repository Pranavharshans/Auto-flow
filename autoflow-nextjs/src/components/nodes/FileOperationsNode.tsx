import React from 'react';
import { Handle, Position } from 'reactflow';
import { AgentNode } from '@/types';

interface FileOperationsNodeProps {
  data: AgentNode;
}

const FileOperationsNode: React.FC<FileOperationsNodeProps> = ({ data }) => {
  return (
    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 min-w-[200px] shadow-sm hover:shadow-md transition-shadow">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          📁
        </div>
        <div>
          <div className="font-medium text-gray-900">{data.name}</div>
          <div className="text-xs text-gray-600 font-medium">File Ops</div>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs text-gray-600">
          Op: {data.fileOperation || 'read'}
        </div>
        <div className="text-xs text-gray-600">
          Format: {data.fileFormat || 'txt'}
        </div>
        <div className="text-xs text-gray-500 bg-white rounded p-1 border">
          {data.filePath || 'Set file path'}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default FileOperationsNode; 