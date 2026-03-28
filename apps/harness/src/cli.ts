import { buildPlan, runRecipe, validateRepository } from '../../../packages/core/src/engine';

type Args = Record<string, string | boolean>;

function parseArgs(argv: string[]): { command: string; args: Args } {
  const [command = 'help', ...rest] = argv;
  const args: Args = {};
  for (let i = 0; i < rest.length; i++) {
    const item = rest[i];
    if (item.startsWith('--')) {
      const key = item.slice(2);
      const next = rest[i + 1];
      if (!next || next.startsWith('--')) args[key] = true;
      else {
        args[key] = next;
        i++;
      }
    }
  }
  return { command, args };
}

function cmdValidate() {
  const result = validateRepository();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exitCode = 1;
}

function cmdPlan(recipeId?: string, env = 'dev') {
  const plan = buildPlan(recipeId ?? 'recipe.fe_change_standard', env);
  console.log(JSON.stringify(plan, null, 2));
}

function cmdRun(recipeId?: string, env = 'dev') {
  const result = runRecipe(recipeId ?? 'recipe.fe_change_standard', env);
  console.log(JSON.stringify(result, null, 2));
  if (result.status !== 'succeeded') process.exitCode = 1;
}

function cmdHelp() {
  console.log(`Industrial Frontend Harness CLI\n\nCommands:\n  validate\n  plan --recipe <id> --env <env>\n  run --recipe <id> --env <env>\n`);
}

const { command, args } = parseArgs(process.argv.slice(2));

switch (command) {
  case 'validate':
    cmdValidate();
    break;
  case 'plan':
    cmdPlan(args.recipe as string | undefined, (args.env as string | undefined) ?? 'dev');
    break;
  case 'run':
    cmdRun(args.recipe as string | undefined, (args.env as string | undefined) ?? 'dev');
    break;
  default:
    cmdHelp();
}
