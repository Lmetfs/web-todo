# Todo · W10 工程化收尾

把 W9 的 TypeScript Todo 项目迁入真实 Vite 工程，补齐 ESLint、构建与测试脚本。

## 命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run build` | `tsc --noEmit && vite build`（先类型检查，再生产构建） |
| `npm test` | `vitest run` 运行全部单元测试 |
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
index.html            Vite 入口
vite.config.ts        构建配置
.eslintrc.cjs         课程三条规则
```
