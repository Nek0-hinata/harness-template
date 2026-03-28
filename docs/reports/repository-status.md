# Harness Template 仓库现状说明

> 本文档用于帮助团队成员、评审者和后续维护者快速理解：这个仓库当前做到了什么、能用来做什么、还缺什么，以及下一步应该如何推进。

## 1. 仓库定位

这个仓库当前不是一个完整的生产平台，而是一个：

**工业前端 Harness 的 v1 原型模板仓库**。

它的目标不是直接上线服务所有团队，而是先把 Harness 的核心结构搭起来，让团队可以：

- 看懂 Harness 应该长什么样
- 用它做内部评审与对齐
- 基于它继续开发真实能力
- 用它接 1–2 个真实项目做试点

一句话总结：

> 这是一个“可运行、可验证、可扩展”的 Harness 起步仓，而不是最终平台。

---

## 2. 这个仓库已经完成了什么

### 2.1 方向与设计文档已经沉淀进仓库

当前仓库已经包含完整的背景与设计文档，不需要依赖聊天记录理解上下文。

关键文档包括：

- `docs/reports/harness-research-report.md`
  - 说明为什么工业前端需要 Harness
  - 明确 Harness 的定义、边界、建设路径

- `docs/reports/harness-architecture-spec.md`
  - 说明 v1 的目标架构、核心模块、一期范围与非目标

- `docs/reports/harness-progress-and-gap-analysis.md`
  - 说明当前仓库的进度、缺口与后续建议

- `docs/runbooks/release.md`
- `docs/runbooks/rollback.md`
- `docs/spec/00-overview.md`

这意味着本仓库已经具备基本的“项目自说明能力”。

---

### 2.2 已建立 Monorepo 基础骨架

仓库已经具备清晰的基础目录结构：

```text
apps/harness           # CLI / 后续 API 入口
packages/core          # 核心类型、加载器、执行引擎
packages/runners       # runner 抽象与实现起点
packages/adapters-git  # Git 适配器起点
packages/tasks-fe      # 前端任务实现起点
packages/tasks-test    # 测试任务实现起点
configs                # 基础与环境配置
specs                  # task / policy / recipe 定义
docs                   # 报告、规范、runbook
```

这个骨架已经足够支持后续持续迭代，而不是一次性脚本堆叠。

---

### 2.3 已定义 Harness 的核心模型

当前仓库已经把 Harness 的核心概念落了下来：

- Task
- Policy
- Recipe
- Runner
- Evidence
- Config

相关代码与定义主要在：

- `packages/core/src/types.ts`
- `packages/core/src/engine.ts`
- `specs/tasks/*.yaml`
- `specs/policies/*.yaml`
- `specs/recipes/*.yaml`

这一步的意义在于：

> 我们已经不是在讨论概念，而是在用仓库结构和代码接口固化概念。

---

### 2.4 已经有可运行的 CLI

仓库当前提供了一个最小但可运行的 CLI：

- `validate`
- `plan`
- `run`

入口文件：

- `apps/harness/src/cli.ts`

它不是静态打印，而是已经会真实读取：

- `configs/base.yaml`
- `configs/environments/*.yaml`
- `specs/tasks/*.yaml`
- `specs/policies/*.yaml`
- `specs/recipes/*.yaml`

因此它已经具备一个真正的 Harness CLI 雏形。

---

### 2.5 已经有最小执行引擎

`packages/core/src/engine.ts` 当前已经支持：

- 读取 YAML 配置
- 校验 Spec 的基本结构
- 加载 Recipe
- 加载 Policies
- 构建执行计划（plan）
- 按 DAG 顺序执行任务
- 生成步骤结果
- 输出 summary
- 写出 artifacts

虽然现在很多执行逻辑还是模板级别，但“编排 + 留痕 + 产物输出”的主干已经打通。

---

### 2.6 已经有一条标准 Recipe

当前默认 Recipe：

- `recipe.fe_change_standard`

它描述了一条典型前端变更链路：

1. `fe.lint.fix`
2. `fe.test.unit`
3. `fe.test.e2e.playwright`
4. `git.open_pr`

这代表仓库已经具备最小的任务编排样板。

---

### 2.7 已经可以生成 artifacts / evidence

执行 `run` 后会生成目录：

```text
artifacts/<run_id>/
```

当前会产出的内容包括：

- lint 日志
- unit report
- e2e report
- trace 文件
- PR 模拟结果
- `run-summary.json`

这对 Harness 很重要，因为它已经具备了“执行证据”的基础能力。

---

### 2.8 已经推送到 GitHub

当前仓库已完成初始化、提交并推送至 GitHub：

- 远端仓库：`git@github.com:Nek0-hinata/harness-template.git`
- 当前主分支：`main`

---

## 3. 这个仓库目前能用来做什么

### 3.1 可以做

当前这个仓库适合：

- 作为 Harness 项目的起步仓
- 作为内部架构评审和方案讨论基础
- 作为团队对齐核心模型的载体
- 作为后续接入真实执行能力的开发底座
- 作为样板平台接一个真实项目做试点

### 3.2 暂时不适合做

当前这个仓库还不适合：

- 直接用于生产环境大规模交付
- 直接替代完整 CI/CD / 发布平台
- 直接服务多个团队的正式平台产品
- 直接接管真实审批、灰度和发布编排

---

## 4. 当前成熟度判断

如果按阶段判断，这个仓库当前处于：

**可演示、可验证、可扩展的 v1 原型阶段**。

可以这样理解：

- 比“文档模板”更强，因为它已经能跑
- 比“单次 PoC”更规范，因为它有结构化 spec、engine 和 artifacts
- 比“生产平台”更早期，因为核心能力仍有不少是占位实现

---

## 5. 当前还缺什么

### 5.1 高优先级缺口

这些是最值得优先补齐的：

1. **真正的 Schema 校验**
   - 当前 `validate` 主要是结构检查
   - 还需要 JSON Schema / Ajv / Zod 级别的严格校验

2. **Task Registry**
   - 当前任务执行仍然偏内嵌分支逻辑
   - 后续应改成 task handler 注册机制

3. **真实 Task 执行**
   - 现在很多 task 仍是 simulated 模板级实现
   - 后续需要接真实的 lint / unit / e2e / git 操作

4. **更完整的 Policy Engine**
   - 当前 policy 只做了基本接入
   - 后续需要真正支持 env、risk、changed paths、审批等规则计算

5. **真实 Git Adapter**
   - 当前 `git.open_pr` 仍是模拟实现
   - 后续应接 GitHub / GitLab API

6. **真实测试执行集成**
   - 需要接入真实的 Vitest / Playwright

---

### 5.2 中优先级缺口

1. `inspect / evidence / explain` CLI 子命令
2. API server 入口
3. 更完整的错误码与状态模型
4. artifact hash / telemetry tags / 审计字段标准化
5. 更细的 runner 抽象与执行上下文模型

---

### 5.3 平台化阶段缺口

1. Dashboard / Portal
2. 多租户 / 组织级权限
3. 资产目录
4. 审批系统接入
5. 灰度 / 分批发布编排
6. ACP Agent 更完整的接入与治理机制

---

## 6. 当前最合理的下一步

如果要继续把这个仓库向“更真实可用”推进，推荐优先做：

1. 接入 `yaml + schema validation`
2. 建立 `task registry`
3. 接入真实 `vitest / playwright`
4. 做更完整的 `policy engine`
5. 增加 `inspect / evidence / explain` CLI
6. 把 PR 模拟改成真实 Git adapter

这几步完成后，仓库就会从“可演示模板”进入“可接真实项目试点”的阶段。

---

## 7. 给新同学/评审者的建议阅读顺序

建议按下面顺序阅读仓库：

1. `README.md`
2. `docs/reports/repository-status.md`（本文）
3. `docs/reports/harness-research-report.md`
4. `docs/reports/harness-architecture-spec.md`
5. `specs/recipes/recipe.fe_change_standard.yaml`
6. `apps/harness/src/cli.ts`
7. `packages/core/src/engine.ts`

这样能最快建立对仓库现状的完整理解。

---

## 8. 一句话总结

> 这个仓库已经把“工业前端 Harness 应该如何组织”落成了一个真实可运行的 v1 原型模板：有文档、有架构、有规范、有 CLI、有最小执行引擎、有 Recipe、有 Evidence、有远端仓库，但还处在从原型走向真实平台的早期阶段。
