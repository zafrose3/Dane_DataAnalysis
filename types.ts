
export enum NodeType {
  DATA_SOURCE = 'DATA_SOURCE',
  FILTER = 'FILTER',
  AGGREGATOR = 'AGGREGATOR',
  VISUALIZER = 'VISUALIZER',
  AI_INSIGHT = 'AI_INSIGHT',
  PYTHON_SCRIPT = 'PYTHON_SCRIPT',
  // Machine Learning
  REGRESSION = 'REGRESSION',
  CLASSIFICATION = 'CLASSIFICATION',
  CLUSTERING = 'CLUSTERING',
  DIM_REDUCTION = 'DIM_REDUCTION',
  // Deep Learning & Advanced
  DEEP_LEARNING = 'DEEP_LEARNING',
  IMAGE_AI = 'IMAGE_AI',
  SENTIMENT = 'SENTIMENT',
  // Data Quality
  DATA_CLEANER = 'DATA_CLEANER',
  OUTLIER_FINDER = 'OUTLIER_FINDER',
  FORECASTER = 'FORECASTER'
}

export interface NodeData {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  config: any;
  inputFrom?: string; // ID of the node providing input
}

export interface DataRow {
  [key: string]: any;
}

export interface WorkflowState {
  nodes: NodeData[];
  selectedNodeId: string | null;
}
