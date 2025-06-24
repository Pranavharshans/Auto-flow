import React from 'react';
import Editor from '@monaco-editor/react';
import { useWorkflowStore } from '../stores/workflowStore';

interface CodePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CodePreviewModal: React.FC<CodePreviewModalProps> = ({ isOpen, onClose }) => {
  const { generatedCode } = useWorkflowStore();

  const downloadCode = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'autoflow_workflow.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    alert('Code copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generated Google ADK Code</h2>
            <p className="text-sm text-gray-500 mt-1">Copy this code to run your workflow</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Copy Code
            </button>
            
            <button
              onClick={downloadCode}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Download .py
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex-1 p-6">
          <Editor
            height="100%"
            language="python"
            value={generatedCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-2">🚀 Next Steps:</div>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Save this code as a .py file</li>
              <li>Install Google ADK: <code className="bg-gray-200 px-1 rounded">pip install google-adk</code></li>
              <li>Run your workflow: <code className="bg-gray-200 px-1 rounded">python autoflow_workflow.py</code></li>
              <li>Modify the input data as needed</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewModal; 