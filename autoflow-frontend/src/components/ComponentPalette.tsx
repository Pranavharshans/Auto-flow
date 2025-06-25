import React from 'react';

const ComponentPalette: React.FC = () => {
  const categories = {
    'Core Agents': [
      {
        type: 'llm-agent',
        label: 'LLM Agent',
        icon: '🤖',
        description: 'AI agent with custom instructions',
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      }
    ],
    'Workflow Control': [
      {
        type: 'sequential-workflow',
        label: 'Sequential',
        icon: '📋',
        description: 'Execute agents in sequence',
        color: 'bg-purple-100 border-purple-300 text-purple-800'
      },
      {
        type: 'parallel-workflow',
        label: 'Parallel',
        icon: '⚡',
        description: 'Execute agents simultaneously',
        color: 'bg-green-100 border-green-300 text-green-800'
      },
      {
        type: 'conditional',
        label: 'Conditional',
        icon: '❓',
        description: 'If/else logic branching',
        color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
      },
      {
        type: 'loop',
        label: 'Loop',
        icon: '🔄',
        description: 'Repeat operations',
        color: 'bg-purple-100 border-purple-300 text-purple-800'
      },
      {
        type: 'router',
        label: 'Router',
        icon: '🧭',
        description: 'Route based on conditions',
        color: 'bg-violet-100 border-violet-300 text-violet-800'
      }
    ],
    'Data & Integration': [
      {
        type: 'input',
        label: 'Input',
        icon: '📝',
        description: 'User input collection',
        color: 'bg-blue-100 border-blue-300 text-blue-800'
      },
      {
        type: 'output',
        label: 'Output',
        icon: '📄',
        description: 'Display results',
        color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
      },
      {
        type: 'api-call',
        label: 'API Call',
        icon: '🌐',
        description: 'External API integration',
        color: 'bg-teal-100 border-teal-300 text-teal-800'
      },
      {
        type: 'database',
        label: 'Database',
        icon: '🗄️',
        description: 'Database operations',
        color: 'bg-orange-100 border-orange-300 text-orange-800'
      },
      {
        type: 'file-operations',
        label: 'File Ops',
        icon: '📁',
        description: 'File read/write operations',
        color: 'bg-gray-100 border-gray-300 text-gray-800'
      }
    ],
    'Processing': [
      {
        type: 'data-transform',
        label: 'Transform',
        icon: '⚙️',
        description: 'Process and transform data',
        color: 'bg-pink-100 border-pink-300 text-pink-800'
      },
      {
        type: 'validator',
        label: 'Validator',
        icon: '✅',
        description: 'Validate data',
        color: 'bg-emerald-100 border-emerald-300 text-emerald-800'
      },
      {
        type: 'variable',
        label: 'Variable',
        icon: '📦',
        description: 'Store/retrieve variables',
        color: 'bg-cyan-100 border-cyan-300 text-cyan-800'
      }
    ],
    'Utilities': [
      {
        type: 'delay',
        label: 'Delay',
        icon: '⏳',
        description: 'Add time delays',
        color: 'bg-amber-100 border-amber-300 text-amber-800'
      },
      {
        type: 'debug',
        label: 'Debug',
        icon: '🐛',
        description: 'Log and inspect data',
        color: 'bg-red-100 border-red-300 text-red-800'
      }
    ]
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-gray-50 border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Components</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {Object.entries(categories).map(([categoryName, items]) => (
            <div key={categoryName}>
              <h3 className="text-sm font-medium text-gray-700 mb-3 border-b border-gray-200 pb-1">
                {categoryName}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.type}
                    className={`p-3 rounded-lg border-2 border-dashed cursor-move hover:shadow-md transition-shadow ${item.color}`}
                    draggable
                    onDragStart={(event) => onDragStart(event, item.type)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <p className="text-xs opacity-80">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 How to use</div>
            <div className="text-xs">
              • Drag components to canvas<br/>
              • Connect with arrows<br/>
              • Configure in properties panel<br/>
              • Generate & run code
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette; 