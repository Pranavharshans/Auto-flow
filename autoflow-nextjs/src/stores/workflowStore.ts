import { create } from 'zustand';
import { AgentNode, WorkflowConnection } from '@/types';

interface WorkflowState {
  // Current workflow state
  nodes: AgentNode[];
  edges: WorkflowConnection[];
  selectedNode: AgentNode | null;
  
  // Actions
  addNode: (node: AgentNode) => void;
  updateNode: (id: string, updates: Partial<AgentNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: WorkflowConnection) => void;
  deleteEdge: (id: string) => void;
  setSelectedNode: (node: AgentNode | null) => void;
  clearWorkflow: () => void;
  
  // Code generation
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  // Initial state
  nodes: [],
  edges: [],
  selectedNode: null,
  generatedCode: '',
  
  // Node operations
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node],
    selectedNode: node
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === id ? { ...node, ...updates } : node
    ),
    selectedNode: state.selectedNode?.id === id 
      ? { ...state.selectedNode, ...updates }
      : state.selectedNode
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== id),
    edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    selectedNode: state.selectedNode?.id === id ? null : state.selectedNode
  })),
  
  // Edge operations
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, edge]
  })),
  
  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter(edge => edge.id !== id)
  })),
  
  // Selection
  setSelectedNode: (node) => set({ selectedNode: node }),
  
  // Workflow operations
  clearWorkflow: () => set({
    nodes: [],
    edges: [],
    selectedNode: null,
    generatedCode: ''
  }),
  
  // Code generation
  setGeneratedCode: (code) => set({ generatedCode: code })
})); 