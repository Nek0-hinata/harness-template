export async function playwrightE2E() {
  return {
    task: 'fe.test.e2e.playwright',
    status: 'simulated',
    reportPath: 'artifacts/playwright-report/index.html',
    tracePath: 'artifacts/playwright-trace.zip',
  };
}
