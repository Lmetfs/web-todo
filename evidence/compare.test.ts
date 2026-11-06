import { test, expect } from 'vitest';
import { parseStoredTodos } from '../src/todo';
import { parseStoredTodosWeakened } from './isTodo.weakened';

// 同一条脏数据：id 是字符串、text 是数字、completed 是字符串
const dirty = JSON.stringify([{ id: '1', text: 1, completed: 'yes' }]);

test('原实现：逐字段类型校验，脏数据被丢弃', () => {
  expect(parseStoredTodos(dirty).length).toBe(0);
});

test('AI 的 every(Boolean) 版本：脏数据被放进来（反证）', () => {
  expect(parseStoredTodosWeakened(dirty).length).toBe(0);
});
