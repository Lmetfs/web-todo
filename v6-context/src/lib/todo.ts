/**
 * 纯业务逻辑层（无 DOM、无 React）
 *
 * 与 W9 的区别只有一条：所有操作都返回**新数组**，不改动入参。
 * 这样 React 的 setTodos(addTodo(todos, text)) 才拿得到新引用，
 * 单测也能直接调这些函数，不需要把逻辑塞进组件里。
 */

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/** 业务契约：去掉首尾空格后超过这个长度视为无效输入 */
export const MAX_TEXT_LENGTH = 100;

/** dataset / localStorage 里来的脏 id 统一从这里过一遍 */
export function toTodoId(raw: string | undefined): number | null {
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

let lastId = 0;

/** 单调递增：同一毫秒内连续添加也不会撞 id */
function nextId(): number {
  lastId = Math.max(Date.now(), lastId + 1);
  return lastId;
}

/**
 * 添加任务。契约：合法文本进、非法文本安静返回原数组。
 * 返回新数组，原数组一个元素都不动。
 */
export function addTodo(todos: readonly Todo[], text: string): Todo[] {
  if (typeof text !== 'string') return todos.slice();
  const trimmed = text.trim();
  if (trimmed === '') return todos.slice();
  if (trimmed.length > MAX_TEXT_LENGTH) return todos.slice();
  return [...todos, { id: nextId(), text: trimmed, completed: false }];
}

/**
 * 切换完成状态。只替换命中的那一个对象，其余元素保持原引用，
 * 这样列表里没变的部分不会被无谓地重渲染。
 */
export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return todos.slice();
  return todos.map((todo, i) =>
    i === index ? { ...todo, completed: !todo.completed } : todo,
  );
}

/** 删除任务。id 不存在时安静返回。 */
export function removeTodo(todos: readonly Todo[], id: number): Todo[] {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return todos.slice();
  return [...todos.slice(0, index), ...todos.slice(index + 1)];
}

/** 清空已完成 */
export function clearCompleted(todos: readonly Todo[]): Todo[] {
  return todos.filter(todo => !todo.completed);
}
