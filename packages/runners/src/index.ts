export interface Runner {
  kind: 'local' | 'ci' | 'docker' | 'k8s-job' | 'remote-agent' | 'acp-agent';
  plan(input: unknown): Promise<unknown>;
  run(input: unknown): Promise<unknown>;
  collectArtifacts(runId: string): Promise<unknown[]>;
}

export class LocalRunner implements Runner {
  kind = 'local' as const;

  async plan(input: unknown): Promise<unknown> {
    return { kind: this.kind, input, status: 'planned' };
  }

  async run(input: unknown): Promise<unknown> {
    return { kind: this.kind, input, status: 'simulated' };
  }

  async collectArtifacts(runId: string): Promise<unknown[]> {
    return [{ runId, type: 'log', uri: `memory://${runId}` }];
  }
}
