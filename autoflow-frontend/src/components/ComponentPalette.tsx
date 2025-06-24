import React from 'react';

const ComponentPalette: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Components</h2>
      
      {/* Basic Agents Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          🤖 Basic Agents
        </h3>
        
        <div className="space-y-2">
          {/* LLM Agent Block */}
          <div
            className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
            draggable
            onDragStart={(event) => onDragStart(event, 'llm-agent')}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">🤖</span>
              <div>
                <div className="font-medium text-gray-900">LLM Agent</div>
                <div className="text-xs text-gray-500">Single AI agent</div>
              </div>
            </div>
          </div>
          
          {/* Sequential Workflow Block */}
          <div
            className="p-3 bg-green-50 border-2 border-green-200 rounded-lg cursor-move hover:bg-green-100 transition-colors"
            draggable
            onDragStart={(event) => onDragStart(event, 'sequential-workflow')}
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">📋</span>
              <div>
                <div className="font-medium text-gray-900">Sequential</div>
                <div className="text-xs text-gray-500">Chain of agents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Future Components Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
          🔧 Future (Not MVP)
        </h3>
        
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-lg opacity-50">
            <div className="flex items-center space-x-2">
              <span className="text-xl">⚡</span>
              <div>
                <div className="font-medium text-gray-500">Parallel Agent</div>
                <div className="text-xs text-gray-400">Coming soon</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-lg opacity-50">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🌳</span>
              <div>
                <div className="font-medium text-gray-500">Conditional Router</div>
                <div className="text-xs text-gray-400">Coming soon</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border-2 border-gray-200 rounded-lg opacity-50">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔁</span>
              <div>
                <div className="font-medium text-gray-500">Loop Agent</div>
                <div className="text-xs text-gray-400">Coming soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Help Text */}
      <div className="mt-8 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="text-sm text-yellow-800">
          <div className="font-medium mb-1">💡 Quick Start</div>
          <div className="text-xs">
            1. Drag an LLM Agent to the canvas<br/>
            2. Click to configure it<br/>
            3. Add more agents and connect them<br/>
            4. Export your Google ADK code!
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette; 