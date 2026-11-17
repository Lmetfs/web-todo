/**
 * 持久化层：只有这里碰 localStorage，业务与组件都不直接读写。
 *
 * 三条约定：
 * ① 读：非法 JSON、非数组、单条脏数据都不允许把页面搞崩 —— 一律降级成「空数组 / 丢掉坏记录」；
 * ② 写：只有一个出口 saveTodos，调用点在 TodoApp 的那个 Effect 里；
 * ③ 键名集中在这里，避免组件里散落字符串。
 */
import type { Todo } from './todo';

export const TODOS_KEY = 'todos-v4';
export const THEME_KEY = 'theme';

export type Theme = 'light' | 'dark';

/** 运行时守卫：interface 编译后不存在，从 JSON 读回来的对象必须逐字段验 */
export function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || !('text' in value) || !('completed' in value)) return false;
  return (
    typeof value.id === 'number' &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    typeof value.text === 'string' &&
    typeof value.completed === 'boolean'
  );
}

/** 解析任意来源的字符串：解析失败、不是数组、元素不合法，都有对应出口 */
export function parseTodos(raw: string | null): Todo[] {
  if (raw === null || raw === '') return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
}

/** 安全读取：页面启动时调用一次（作为 useState 的惰性初始化函数传进去） */
export function loadTodos(): Todo[] {
  return parseTodos(localStorage.getItem(TODOS_KEY));
}

/** 唯一写入出口 */
export function saveTodos(todos: readonly Todo[]): void {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
}

/** 主题也要能记住，否则刷新一次就跳回浅色 */
export function loadTheme(): Theme {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(THEME_KEY, theme);
}
