import { defineConfig } from 'vitest/config';

/**
 * 常规单测只跑 src/ 下的用例（12 个），保证 `npm test` 恒为绿。
 * evidence/ 是预期失败的反证实验，不混进来，见 vitest.evidence.config.ts。
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
