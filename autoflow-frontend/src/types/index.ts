// Core agent and workflow types
export interface AgentNode {
  id: string;
  type: 'llm-agent' | 'sequential-workflow' | 'parallel-workflow' | 'conditional' | 'loop' | 'input' | 'output' | 'api-call' | 'database' | 'file-operations' | 'data-transform' | 'validator' | 'router' | 'delay' | 'debug' | 'variable';
  name: string;
  instruction: string;
  model: string;
  position: { x: number; y: number };
  
  // Conditional node properties
  condition?: string;
  conditionType?: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
  
  // Loop node properties
  loopType?: 'for-each' | 'while' | 'fixed-count';
  loopCount?: number;
  loopCondition?: string;
  
  // Input/Output node properties
  inputType?: 'text' | 'number' | 'file' | 'json';
  outputFormat?: 'text' | 'json' | 'table' | 'chart';
  placeholder?: string;
  
  // API Call node properties
  apiUrl?: string;
  apiMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  apiHeaders?: Record<string, string>;
  apiBody?: string;
  
  // Database node properties
  dbType?: 'mysql' | 'postgres' | 'mongodb' | 'sqlite';
  dbQuery?: string;
  dbOperation?: 'select' | 'insert' | 'update' | 'delete';
  
  // File operations properties
  fileOperation?: 'read' | 'write' | 'append' | 'delete';
  filePath?: string;
  fileFormat?: 'txt' | 'json' | 'csv' | 'xml';
  
  // Data transform properties
  transformType?: 'map' | 'filter' | 'reduce' | 'sort' | 'group';
  transformScript?: string;
  
  // Validator properties
  validationType?: 'required' | 'format' | 'range' | 'custom';
  validationRules?: string;
  
  // Router properties
  routingRules?: Array<{ condition: string; target: string }>;
  
  // Delay properties
  delayAmount?: number;
  delayUnit?: 'seconds' | 'minutes' | 'hours';
  
  // Variable properties
  variableName?: string;
  variableValue?: string;
  variableType?: 'string' | 'number' | 'boolean' | 'array' | 'object';
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