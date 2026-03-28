# Harness 模板仓库进度、已完成项与缺口梳理

## 1. 当前仓库位置

- 本地目录：`C:\Users\11605\.openclaw\workspace\industrial-fe-harness-template`

## 2. 当前已完成内容

### 2.1 仓库骨架
已完成：
- `README.md`
- `CONTRIBUTING.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.json`
- `.gitignore`
- `.editorconfig`
- `.github/workflows/harness.yml`

### 2.2 配置与规范
已完成：
- `configs/base.yaml`
- `configs/environments/dev.yaml`
- `configs/environments/staging.yaml`
- `configs/environments/prod.yaml`
- `specs/tasks/fe.codegen.page.yaml`
- `specs/tasks/fe.test.e2e.playwright.yaml`
- `specs/policies/policy.prod_change_gate.yaml`
- `specs/recipes/recipe.fe_change_standard.yaml`

### 2.3 代码骨架
已完成：
- `apps/harness/src/cli.ts`
- `packages/core/src/types.ts`
- `packages/core/src/engine.ts`
- `packages/runners/src/index.ts`
- `packages/adapters-git/src/index.ts`
- `packages/tasks-fe/src/lintFix.ts`
- `packages/tasks-test/src/playwrightE2E.ts`

### 2.4 文档与 Runbook
已完成：
- `docs/spec/00-overview.md`
- `docs/runbooks/release.md`
- `docs/runbooks/rollback.md`
- 本目录下的研究、架构与进度文档

## 3. 当前已经能做到什么

### 3.1 CLI 可运行
当前支持：
- `validate`
- `plan`
- `run`

### 3.2 可读取真实配置与 Spec
当前 CLI 已接入：
- YAML 解析
- 读取 `configs/*`
- 读取 `specs/tasks/*`
- 读取 `specs/policies/*`
- 读取 `specs/recipes/*`

### 3.3 可执行最小 Recipe
默认 `recipe.fe_change_standard` 当前可跑通以下步骤：
- `fe.lint.fix`
- `fe.test.unit`
- `fe.test.e2e.playwright`
- `git.open_pr`

### 3.4 可生成 Evidence
当前会输出到：
- `artifacts/<run_id>/`

当前会生成：
- lint log
- unit report
- e2e report
- trace 文件
- PR 模拟结果
- run-summary.json

## 4. 当前实现的性质

当前仓库已经不是纯文档模板，而是一个：

> **可运行的 Harness v1 原型模板**

但它仍然属于：
- 可演示
- 可验证
- 可继续扩展

还不属于：
- 可直接上生产
- 可直接接真实 GitHub/GitLab / Playwright / 审批系统 / 发布系统 的完整平台

## 5. 当前还缺什么

### 5.1 高优先级缺口
1. 真正的 schema 校验
2. 真正的 task registry
3. 真实 task 执行（而不是 simulated）
4. 真实 policy engine
5. 真实 git adapter
6. 真实 e2e / unit 执行集成
7. 更完整的 evidence store

### 5.2 中优先级缺口
1. inspect / evidence / explain CLI 子命令
2. API server 入口
3. 更清晰的 error code / status model
4. changed paths / risk level / env-based policy decision
5. artifact hash / telemetry tags /审计字段标准化

### 5.3 后续平台化缺口
1. Dashboard / Portal
2. 多租户 / 组织权限
3. 资产目录
4. 审批系统接入
5. 灰度 / 批次发布编排
6. ACP Agent 更完整接入规范

## 6. 建议下一步

### 下一阶段最值得做的事
- 接入 `yaml + schema validation`
- 做 `task registry`
- 接入真实 `vitest / playwright`
- 做更像样的 `policy engine`
- 增加 `inspect / evidence / explain`
- 把 PR 模拟改成真实 GitHub/GitLab adapter

## 7. GitHub 推送状态

目标仓库：`git@github.com:Nek0-hinata/harness-template.git`

当前阻塞：
- 本机对该 SSH 远端执行 `git ls-remote` 时失败
- 报错为 `Host key verification failed`

因此目前状态是：
- 本地代码与文档已整理完成
- 远端推送尚未成功
- 需要先修复本机到 GitHub 的 SSH 信任 / 访问权限

## 8. 总结

当前这套仓库已经具备：
- 方向文档
- 架构文档
- 模板规范
- 本地可运行 CLI 原型
- 可执行的最小 recipe
- 可产出 evidence 的演示链路

下一步最合理的路线是：
- 先修复 GitHub 推送
- 再继续补真实 task 执行与真实 adapter
- 然后接样板项目做第一次实战验证
