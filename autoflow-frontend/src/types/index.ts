// Core agent and workflow types
export interface AgentNode {
  id: string;
  type: 'llm-agent' | 'sequential-workflow';
  name: string;
  instruction: string;
  model: string;
  position: { x: number; y: number };
}

export interface WorkflowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: AgentNode[];
  edges: WorkflowConnection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeGenerationResult {
  code: string;
  isValid: boolean;
  errors: string[];
}

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  executionTime: number;
} 