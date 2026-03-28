# Industrial Frontend Harness

一个面向工业前端生产的 Harness 系统模板仓库，用于统一任务编排、执行、测试、发布、回滚、审计与观测。

## Goals
- 标准化前端交付流程
- 统一测试与发布门禁
- 支持 AI / ACP 任务受控接入
- 提供可追踪、可回滚、可审计的生产能力

## Core Concepts
- Task
- Adapter
- Runner
- Policy
- Recipe
- Telemetry

## Repository Layout
- `apps/harness`：CLI / API 入口
- `packages/core`：核心类型、执行引擎、策略引擎、观测
- `packages/runners`：运行器实现
- `packages/adapters-*`：外部系统适配器
- `packages/tasks-*`：任务实现
- `specs`：Task / Policy / Recipe 规范
- `configs`：基础与环境配置
- `docs`：规范、Runbook、设计说明

## Quick Start
```bash
pnpm install
pnpm harness validate
pnpm harness plan --recipe recipe.fe_change_standard --env dev
```

## Rules
- 自动修改代码行为必须走 PR
- 生产变更必须满足 policy
- 所有 run 必须生成 evidence
- 高风险任务必须支持审计与回滚
