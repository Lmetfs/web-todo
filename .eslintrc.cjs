/* W10 · ESLint 配置（.eslintrc.cjs，ESLint 8 传统配置格式） */
module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // 本机 TypeScript 版本较新，关闭版本告警，避免它被算进 warning 数
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // 课程要求的三条硬规则
    complexity: ['error', 10],
    'max-depth': ['error', 3],
    '@typescript-eslint/no-explicit-any': 'error',
    // TypeScript 自己会做未定义检查，保留 no-undef 只会误报类型名
    'no-undef': 'off',
  },
  ignorePatterns: ['dist/', 'node_modules/'],
};
