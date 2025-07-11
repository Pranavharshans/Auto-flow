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
        <ComponentPalette />
        
        {/* Main Canvas */}
        <div className="flex-1 relative">
          <WorkflowCanvas />
        </div>
        
        {/* Property Panel */}
        <PropertyPanel />
      </div>
    </div>
  );
}

export default App;
