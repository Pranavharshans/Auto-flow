import React from 'react';
import { useForm } from 'react-hook-form';
import { useWorkflowStore } from '../stores/workflowStore';
import { AgentNode } from '../types';

const PropertyPanel: React.FC = () => {
  const { selectedNode, updateNode, deleteNode } = useWorkflowStore();
  
  const { register, handleSubmit, setValue } = useForm<AgentNode>({
    defaultValues: selectedNode || undefined,
  });

  // Update form when selected node changes
  React.useEffect(() => {
    if (selectedNode) {
      setValue('name', selectedNode.name);
      setValue('instruction', selectedNode.instruction);
      setValue('model', selectedNode.model);
    }
  }, [selectedNode, setValue]);

  const onSubmit = (data: AgentNode) => {
    if (selectedNode) {
      updateNode(selectedNode.id, {
        name: data.name,
        instruction: data.instruction,
        model: data.model,
      });
    }
  };

  const handleDelete = () => {
    if (selectedNode && window.confirm('Delete this agent?')) {
      deleteNode(selectedNode.id);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">🎯</div>
            <div className="text-sm">Select an agent to configure its properties</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 h-full bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Agent Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter agent name"
            />
          </div>

          {/* Model Selection */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model
            </label>
            <select
              {...register('model')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
            </select>
          </div>

          {/* Agent Instructions */}
          {selectedNode.type === 'llm-agent' && (
            <div>
              <label htmlFor="instruction" className="block text-sm font-medium text-gray-700 mb-1">
                Instruction
              </label>
              <textarea
                {...register('instruction', { required: 'Instruction is required' })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter detailed instructions for this agent..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Describe what this agent should do and how it should behave.
              </p>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save Changes
            </button>
          </div>
        </form>

        {/* Agent Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Agent Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div><strong>Type:</strong> {selectedNode.type}</div>
            <div><strong>ID:</strong> {selectedNode.id}</div>
            <div><strong>Position:</strong> ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})</div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 Tips</div>
            <div className="text-xs">
              • Be specific in your instructions<br/>
              • Use clear, actionable language<br/>
              • Test with simple inputs first<br/>
              • Connect agents with arrows
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel; 