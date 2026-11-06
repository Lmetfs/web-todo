# Todo · W10 工程化收尾

把 W9 的 TypeScript Todo 项目迁入真实 Vite 工程，补齐 ESLint、构建与测试脚本。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | `tsc --noEmit && vite build`（先类型检查，再生产构建） |
| `npm test` | `vitest run` 运行全部单元测试（只跑 `src/`，12 个用例） |
| `npm run test:evidence` | 运行 `evidence/` 反证实验，**预期失败**（见下） |
| `npm run lint` | `eslint src/` 按课程三条规则检查 |

## 工程约束

- `tsconfig.json` 开启 `strict: true`。
- ESLint：`complexity ≤ 10`、`max-depth ≤ 3`、`@typescript-eslint/no-explicit-any = error`。
- 版本说明：`@typescript-eslint@8.72` 的 peer 要求 `typescript < 6.1`，因此 TypeScript 固定为 `6.0.x`（Vite / Vitest 不依赖 tsc 版本，构建与测试不受影响）。

## 目录

```
src/
  todo.ts             纯业务函数（可单测，不碰 DOM）
  main.ts             DOM 接线：事件委托 + 渲染
  todo.hand.test.ts   手写用例
  todo.patched.test.ts 修补后的边界用例
evidence/
  isTodo.weakened.ts  复现 AI 的 every(Boolean) 弱校验写法
  compare.test.ts     同一份脏数据分别喂两个实现，预期一绿一红
index.html            Vite 入口
vite.config.ts        构建配置
vitest.config.ts      单测范围（只跑 src/）
vitest.evidence.config.ts 反证实验范围（只跑 evidence/）
.eslintrc.cjs         课程三条规则
```

## 关于 evidence/：为什么它不在 src/，也不进 `npm test`

`evidence/` 是「AI 想把逐字段校验改写成 `every(Boolean)`」这次规避行为的**反证实验**，用途是让「业务被改弱」这件事从文字推断变成可执行证据。它故意不放进 `src/`、不参与 `tsc --noEmit` 与 `vite build`、也不进 `npm test`：

- 混进来会让 `npm test` 永远红（一个预期失败的用例会把整条 CI 拖红），工程上是反模式；
- 想复现就单独跑 `npm run test:evidence`，它会红给你看：原实现丢弃脏数据（✓），`every(Boolean)` 版本放行（×，`expected 1 to be +0`）。
