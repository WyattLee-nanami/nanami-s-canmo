# Vercel + Supabase 集成 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `client` 部署到 Vercel，并接入 Supabase Auth + Postgres + RLS，实现每用户独立的 meals/weight/goals 数据与首页统计。

**Architecture:** 前端直连 Supabase（`@supabase/supabase-js`）。Supabase Postgres 承载业务表并启用 RLS；前端通过 `client/src/api/client.ts` 统一访问数据。Vercel 仅负责构建与托管前端，并通过环境变量注入 Supabase 配置。

**Tech Stack:** React + Vite；Supabase Auth；Supabase Postgres + RLS；Vercel.

---

## Task 1: Supabase SQL 与 RLS 策略（交付可复制脚本）

**Files:**
- Create: `docs/superpowers/plans/assets/supabase-setup.sql`

- [ ] Step 1: 编写 SQL：创建 `meals`、`weight_records`、`goals`，含主键、约束、索引
- [ ] Step 2: 编写 SQL：开启 RLS，并添加 policies（select/insert/update/delete：`user_id = auth.uid()`）
- [ ] Step 3: 编写 SQL：设置 `goals` 每用户唯一（unique `user_id`）用于 upsert
- [ ] Step 4: 交付说明文档：如何在 Supabase Dashboard 运行 SQL

## Task 2: 前端 Supabase SDK 封装

**Files:**
- Create: `client/src/lib/supabase.ts`
- Modify: `client/src/vite-env.d.ts`（若存在则需要 env 类型）

- [ ] Step 1: 创建 `supabase` 实例（读取 `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`）
- [ ] Step 2: 增加基础类型/导出命名，确保可在 API 层复用

## Task 3: 前端认证 UI（邮箱+密码）

**Files:**
- Create: `client/src/pages/AuthPage.tsx`
- Modify: `client/src/App.tsx`（或顶层路由/布局组件）以实现：未登录 -> 显示 AuthPage，登录 -> 渲染主页面

- [ ] Step 1: 实现登录表单（email/password -> `supabase.auth.signInWithPassword`）
- [ ] Step 2: 实现注册表单（email/password -> `supabase.auth.signUp`）
- [ ] Step 3: 实现登出按钮（`supabase.auth.signOut`）
- [ ] Step 4: 处理会话状态（`getSession` + `onAuthStateChange`）

## Task 4: API 层迁移：用 Supabase 替代 `/api` fetch

**Files:**
- Modify: `client/src/api/client.ts`

- [ ] Step 1: `mealsApi.getDaily`：查询 meals（过滤 date + 当前用户），计算 `totalCalories`
- [ ] Step 2: `mealsApi.create`：insert meals（包含 user_id）
- [ ] Step 3: `mealsApi.remove`：delete meals by id（配合 RLS）
- [ ] Step 4: `weightApi.getAll`：select weight_records（按 date asc）
- [ ] Step 5: `weightApi.create`：按 date upsert（若 RLS 正确允许 upsert/或先 upsert 逻辑后续调整）
- [ ] Step 6: `goalsApi.get`：select goals（按当前用户，若不存在走初始化）
- [ ] Step 7: `goalsApi.update`：update goals（按当前用户，或 upsert）
- [ ] Step 8: `statsApi.getDaily`：复用 `getDaily` 页面所需字段；实现 meals 聚合与 remaining
- [ ] Step 9: `statsApi.getWeekly`：循环最近 7 天聚合（先简单实现即可）
- [ ] Step 10: 统一错误处理（把 Supabase error 转换为现有页面可理解的 message）

## Task 5: 本地验证（在不部署的情况下能跑通）

**Files:**
- Modify: `client/.env.example`（如不存在可新建）或写清楚环境变量

- [ ] Step 1: 创建本地环境变量示例（VITE_SUPABASE_URL/ANON_KEY）
- [ ] Step 2: 确认本地 `npm run dev --workspace=client` 能成功登录并读写数据
- [ ] Step 3: 验证隔离：用两个不同用户写 meals 后确认互不可见
- [ ] Step 4: 验证首页：加载今日摘要、添加/删除记录可刷新

## Task 6: Vercel 部署配置

**Files:**
- Modify: `vercel.json`（仅当需要 SPA 回退时）

- [ ] Step 1: 指导在 Vercel 里导入仓库并选择 Root Directory=client
- [ ] Step 2: 设置环境变量：`VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`
- [ ] Step 3: 如需 History API 回退，添加 `vercel.json` rewrite（Vite SPA）
- [ ] Step 4: 确认 Build 成功并打开生产域名验证登录/读写

---

## Task 7: 回滚/质量检查

- [ ] Step 1: 如果出现数据不可见/写入失败，先检查 RLS policy 是否覆盖到对应操作
- [ ] Step 2: 若构建失败，回退到已知稳定 commit（通过 Git tags 或手动切回）
- [ ] Step 3: 最终确认用户隔离、页面统计一致性

