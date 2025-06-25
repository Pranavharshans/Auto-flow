import React, { useState } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import { generateGoogleADKCode } from '../utils/codeGenerator';
import CodePreviewModal from './CodePreviewModal';

const TopNavigation: React.FC = () => {
  const { nodes, edges, clearWorkflow, setGeneratedCode } = useWorkflowStore();
  const [showCodeModal, setShowCodeModal] = useState(false);

  const handleGenerateCode = () => {
    const result = generateGoogleADKCode(nodes, edges);
    setGeneratedCode(result.code);
    setShowCodeModal(true);
  };

  const handleNewWorkflow = () => {
    if (window.confirm('Create a new workflow? This will clear your current work.')) {
      clearWorkflow();
    }
  };

  const handleRunWorkflow = () => {
    // For MVP, we'll just show an alert
    alert('Workflow execution coming soon! For now, you can export the generated code.');
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">🚀 Autoflow MVP</h1>
          <span className="text-sm text-gray-500">Visual Multi-Agent Builder</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleNewWorkflow}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            New
          </button>
          
          <button
            onClick={handleGenerateCode}
            disabled={nodes.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export Code
          </button>
          
          <button
            onClick={handleRunWorkflow}
            disabled={nodes.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run Workflow
          </button>
        </div>
      </div>
      
      <CodePreviewModal 
        isOpen={showCodeModal} 
        onClose={() => setShowCodeModal(false)} 
      />
    </>
  );
};

export default TopNavigation; 