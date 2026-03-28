export type RiskLevel = 'low' | 'medium' | 'high';

export interface TaskSpec {
  id: string;
  version: string;
  riskLevel: RiskLevel;
  inputSchema: object;
  outputSchema: object;
}

export interface PolicyDecision {
  allowed: boolean;
  reasons: string[];
  requiredApprovals?: number;
}

export interface EvidenceItem {
  type: 'report' | 'trace' | 'screenshot' | 'artifact' | 'log' | 'pr';
  name: string;
  uri: string;
  metadata?: Record<string, unknown>;
}

export interface RunRecord {
  runId: string;
  recipeId?: string;
  taskId?: string;
  actor: string;
  environment: string;
  status: 'pending' | 'running' | 'failed' | 'succeeded' | 'rolled_back' | 'simulated';
}
