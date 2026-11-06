export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

/**
 * AI 提议的“更短”写法：只判断字段值是否为真，不校验类型。
 * 仅用于反证实验，不进入 src/，不参与构建。
 */
export function parseStoredTodosWeakened(raw: string | null): Todo[] {
  if (raw === null || raw === '') return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((value): value is Todo => {
    if (typeof value !== 'object' || value === null) return false;
    const record = value as Record<string, unknown>;
    return ['id', 'text', 'completed'].every((key) => Boolean(record[key]));
  });
}
