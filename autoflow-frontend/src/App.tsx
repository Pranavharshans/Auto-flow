import React from 'react';
import './App.css';
import WorkflowCanvas from './components/WorkflowCanvas';
import ComponentPalette from './components/ComponentPalette';
import PropertyPanel from './components/PropertyPanel';
import TopNavigation from './components/TopNavigation';

function App() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <TopNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <ComponentPalette />
        </div>
        
        {/* Main Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>
        
        {/* Property Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0">
          <PropertyPanel />
        </div>
      </div>
    </div>
  );
}

export default App;
