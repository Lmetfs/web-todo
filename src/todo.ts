/**
 * W9 · task 1：TypeScript 重构
 *
 * 守住三条红线（实验课第 8 页）：
 *   ① 不用 any    ② 不用非空断言 !    ③ 不用 as 硬转
 *
 * 脏数据只有两个入口（第 7 页）：
 *   ① dataset.id 永远是 string
 *   ② localStorage 解析后不受控
 * 两处都必须走「先转换、再校验」：Number() + Number.isSafeInteger()。
 */

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/** 业务契约：超过这个长度的文本视为无效输入，不写入 */
export const MAX_TEXT_LENGTH = 100;

/* ------------------------------------------------------------------ */
/* 一、id 的转换与校验（脏数据入口 ①）                                 */
/* ------------------------------------------------------------------ */

/**
 * dataset.id 是 string，这里是唯一的转换入口。
 * 三种坏值都被挡住：
 *   '123abc' → NaN      → isSafeInteger 返回 false
 *   '1.5'    → 1.5      → 不是安全整数
 *   ''       → 0        → 被 <= 0 挡掉
 */
export function toTodoId(raw: string | undefined): number | null {
  const id = Number(raw);
  if (!Number.isSafeInteger(id) || id <= 0) return null;
  return id;
}

/**
 * 事件委托里从「真正被点到的元素」反查 Todo.id。
 * 顺序不能反：先 instanceof 收窄，再取 dataset，最后校验。
 */
export function readTodoId(target: EventTarget | null): number | null {
  if (!(target instanceof HTMLElement)) return null;
  const item = target.closest('li');
  if (!(item instanceof HTMLElement)) return null;
  return toTodoId(item.dataset.id);
}

/* ------------------------------------------------------------------ */
/* 二、localStorage 的解析与校验（脏数据入口 ②）                       */
/* ------------------------------------------------------------------ */

/** 运行时类型守卫：interface 在运行时不存在，从 JSON 读回来的必须逐字段验 */
function isTodo(value: unknown): value is Todo {
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

/** 脏数据一律丢弃，不让一条坏记录把整页搞崩 */
export function parseStoredTodos(raw: string | null): Todo[] {
  if (raw === null || raw === '') return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isTodo);
}

/* ------------------------------------------------------------------ */
/* 三、业务操作                                                        */
/* ------------------------------------------------------------------ */

let lastId = 0;

/** 单调递增的 id，避免同一毫秒内连续添加拿到重复 id */
function nextId(): number {
  lastId = Math.max(Date.now(), lastId + 1);
  return lastId;
}

/**
 * 添加任务。
 * 契约：无效输入（非字符串 / 空串 / 纯空格 / 超长）不改变数据，安静返回。
 */
export function addTodo(todos: Todo[], text: string): void {
  if (typeof text !== 'string') return;
  const trimmed = text.trim();
  if (trimmed === '') return;
  if (trimmed.length > MAX_TEXT_LENGTH) return;
  todos.push({ id: nextId(), text: trimmed, completed: false });
}

/** 切换完成状态。契约：id 不存在时安静返回，不抛错、不崩溃。 */
export function toggleTodo(todos: Todo[], id: number): void {
  const target = todos.find(todo => todo.id === id);
  if (target === undefined) return;
  target.completed = !target.completed;
}

export function removeTodo(todos: Todo[], id: number): void {
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return;
  todos.splice(index, 1);
}

export function clearCompleted(todos: Todo[]): void {
  for (let i = todos.length - 1; i >= 0; i -= 1) {
    const item = todos[i];
    if (item !== undefined && item.completed) todos.splice(i, 1);
  }
}
