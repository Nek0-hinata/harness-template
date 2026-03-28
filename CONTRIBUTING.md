# Contributing

## Branch Strategy
- `feature/*`
- `fix/*`
- `chore/*`
- `release/*`

## Commit Convention
- `feat:`
- `fix:`
- `chore:`
- `docs:`
- `refactor:`
- `test:`

## Development Flow
1. 编写或更新 spec
2. 本地执行 `harness validate`
3. 本地执行必要 task / recipe
4. 提交 PR
5. CI 通过后合并

## Adding a New Task
必须提供：
- task spec
- input/output schema
- evidence 定义
- risk level
- rollback 说明（如适用）
- 测试

## Adding a New Policy
必须说明：
- 适用范围
- 风险理由
- 例外机制
- 审批要求
