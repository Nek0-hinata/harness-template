export interface OpenPRInput {
  title: string;
  body?: string;
  branch: string;
  base?: string;
}

export async function openPR(input: OpenPRInput) {
  return {
    provider: 'git',
    action: 'open_pr',
    status: 'simulated',
    ...input,
  };
}
