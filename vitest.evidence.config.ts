import { defineConfig } from 'vitest/config';

/**
 * 反证实验专用配置：只跑 evidence/ 下的用例，且**预期失败**。
 * 用途：证明 AI 那版 every(Boolean) 改写会放行脏数据。
 * 单独执行：npm run test:evidence
 */
export default defineConfig({
  test: {
    include: ['evidence/**/*.test.ts'],
  },
});
