import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import YAML from 'yaml';

export type Dict = Record<string, unknown>;

export interface TaskNode {
  id: string;
  task: string;
  depends_on?: string[];
}

export interface RecipeSpecFile {
  apiVersion: string;
  kind: 'Recipe';
  metadata: { id: string; version: string };
  spec: {
    graph: TaskNode[];
    on_failure?: { strategy: 'stop' | 'rollback' | 'continue'; recipeId?: string };
  };
}

export interface PolicySpecFile {
  apiVersion: string;
  kind: 'Policy';
  metadata: { id: string; version: string };
  spec: Dict;
}

export interface LoadedConfig {
  base: Dict;
  env: Dict;
  merged: Dict;
}

export interface RunStepResult {
  id: string;
  task: string;
  status: 'success' | 'failed' | 'skipped';
  evidence: Array<{ type: string; path: string }>;
  output?: Dict;
  error?: string;
}

function cwdPath(...parts: string[]) {
  return join(process.cwd(), ...parts);
}

export function parseYamlFile<T = Dict>(filePath: string): T {
  return YAML.parse(readFileSync(filePath, 'utf8')) as T;
}

export function listYamlFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'))
    .map((name) => join(dir, name));
}

export function loadConfig(env: string): LoadedConfig {
  const basePath = cwdPath('configs', 'base.yaml');
  const envPath = cwdPath('configs', 'environments', `${env}.yaml`);
  const base = existsSync(basePath) ? parseYamlFile<Dict>(basePath) : {};
  const envConfig = existsSync(envPath) ? parseYamlFile<Dict>(envPath) : {};
  return {
    base,
    env: envConfig,
    merged: {
      ...base,
      environment: env,
      envConfig,
    },
  };
}

export function loadRecipe(recipeId: string): RecipeSpecFile {
  const filePath = cwdPath('specs', 'recipes', `${recipeId}.yaml`);
  if (!existsSync(filePath)) {
    throw new Error(`Recipe not found: ${recipeId}`);
  }
  return parseYamlFile<RecipeSpecFile>(filePath);
}

export function loadPolicies(): PolicySpecFile[] {
  return listYamlFiles(cwdPath('specs', 'policies')).map((file) => parseYamlFile<PolicySpecFile>(file));
}

export function validateRepository(): { ok: boolean; items: Array<{ file: string; ok: boolean; reason?: string }> } {
  const files = [
    ...listYamlFiles(cwdPath('specs', 'tasks')),
    ...listYamlFiles(cwdPath('specs', 'policies')),
    ...listYamlFiles(cwdPath('specs', 'recipes')),
  ];

  const items = files.map((file) => {
    try {
      const parsed = parseYamlFile<Dict>(file);
      if (!parsed.apiVersion || !parsed.kind || !parsed.metadata || !parsed.spec) {
        return { file, ok: false, reason: 'missing required root fields' };
      }
      return { file, ok: true };
    } catch (error) {
      return { file, ok: false, reason: error instanceof Error ? error.message : 'unknown parse error' };
    }
  });

  return { ok: items.every((item) => item.ok), items };
}

export function buildPlan(recipeId: string, env: string) {
  const recipe = loadRecipe(recipeId);
  const policies = loadPolicies();
  const approvalsRequired = env === 'prod' ? 2 : 0;
  return {
    recipeId,
    env,
    graph: recipe.spec.graph,
    policyHits: policies.map((p) => p.metadata.id).filter((id) => env === 'prod' ? true : id !== 'policy.prod_change_gate'),
    approvalsRequired,
    onFailure: recipe.spec.on_failure ?? { strategy: 'stop' },
  };
}

function ensureArtifactsDir(runId: string) {
  const dir = cwdPath('artifacts', runId);
  mkdirSync(dir, { recursive: true });
  return dir;
}

function simulateTask(task: string, stepId: string, runId: string): RunStepResult {
  const dir = ensureArtifactsDir(runId);
  switch (task) {
    case 'fe.lint.fix': {
      const file = join(dir, `${stepId}.log.txt`);
      writeFileSync(file, 'Lint fix simulated successfully.\n', 'utf8');
      return {
        id: stepId,
        task,
        status: 'success',
        evidence: [{ type: 'log', path: file }],
        output: { changedFiles: [] },
      };
    }
    case 'fe.test.unit': {
      const file = join(dir, `${stepId}.unit-report.txt`);
      writeFileSync(file, 'Unit tests simulated: passed=12 failed=0\n', 'utf8');
      return {
        id: stepId,
        task,
        status: 'success',
        evidence: [{ type: 'report', path: file }],
        output: { passed: 12, failed: 0 },
      };
    }
    case 'fe.test.e2e.playwright': {
      const report = join(dir, `${stepId}.playwright-report.html`);
      const trace = join(dir, `${stepId}.trace.zip`);
      writeFileSync(report, '<html><body><h1>Simulated Playwright Report</h1></body></html>', 'utf8');
      writeFileSync(trace, 'simulated-trace', 'utf8');
      return {
        id: stepId,
        task,
        status: 'success',
        evidence: [
          { type: 'report', path: report },
          { type: 'trace', path: trace },
        ],
        output: { reportPath: report, tracePath: trace },
      };
    }
    case 'git.open_pr': {
      const file = join(dir, `${stepId}.pr.json`);
      writeFileSync(file, JSON.stringify({ title: 'Simulated Harness PR', status: 'opened' }, null, 2), 'utf8');
      return {
        id: stepId,
        task,
        status: 'success',
        evidence: [{ type: 'pr', path: file }],
        output: { provider: 'git', status: 'opened' },
      };
    }
    default:
      return {
        id: stepId,
        task,
        status: 'failed',
        evidence: [],
        error: `Unknown task implementation: ${task}`,
      };
  }
}

export function runRecipe(recipeId: string, env: string) {
  const plan = buildPlan(recipeId, env);
  const runId = `run_${Date.now()}`;
  const stepResults: RunStepResult[] = [];
  const completed = new Set<string>();

  for (const step of plan.graph) {
    const deps = step.depends_on ?? [];
    const depsOk = deps.every((dep) => completed.has(dep));
    if (!depsOk) {
      stepResults.push({
        id: step.id,
        task: step.task,
        status: 'skipped',
        evidence: [],
        error: 'dependencies not satisfied',
      });
      continue;
    }

    const result = simulateTask(step.task, step.id, runId);
    stepResults.push(result);
    if (result.status === 'success') {
      completed.add(step.id);
      continue;
    }

    if (plan.onFailure.strategy === 'stop') {
      break;
    }
  }

  const status = stepResults.every((step) => step.status === 'success') ? 'succeeded' : 'failed';
  const summaryPath = join(ensureArtifactsDir(runId), 'run-summary.json');
  const summary = { runId, recipeId, env, status, steps: stepResults };
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf8');

  return {
    runId,
    recipeId,
    env,
    status,
    steps: stepResults,
    summaryPath,
  };
}
