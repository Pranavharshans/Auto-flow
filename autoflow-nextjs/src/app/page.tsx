'use client';

import React from 'react';
import WorkflowCanvas from '@/components/WorkflowCanvas';
import ComponentPalette from '@/components/ComponentPalette';
import PropertyPanel from '@/components/PropertyPanel';
import TopNavigation from '@/components/TopNavigation';

export default function Home() {
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
