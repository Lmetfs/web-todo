/**
 * 轨道 A：单测回归
 *
 * 迁移到 React 之后，这些函数一行都没改，测试也就一行都不用改 —— 这正是把
 * 业务逻辑留在纯函数里的价值：组件怎么换，业务契约仍然由同一批用例守着。
 *
 * 除了“行为对不对”，这里还额外断言**不可变性**：每次操作都必须返回新数组，
 * 原数组一个元素都不能被动。React 的 setState 依赖引用变化来触发重渲染。
 */
import { test, expect } from 'vitest';
import {
  addTodo,
  clearCompleted,
  MAX_TEXT_LENGTH,
  removeTodo,
  toggleTodo,
  type Todo,
} from './todo';
import { parseTodos } from './storage';

const sample = (): Todo[] => [
  { id: 1, text: '学习TS', completed: false },
  { id: 2, text: '写周报', completed: true },
];

test('添加：返回新数组，原数组不受影响', () => {
  const todos = sample();

  const next = addTodo(todos, '复习 React');

  expect(next).not.toBe(todos);        // 新引用，React 才认得出变化
  expect(todos.length).toBe(2);        // 原数组没被顺手 push
  expect(next.length).toBe(3);
  expect(next[2].text).toBe('复习 React');
  expect(next[2].completed).toBe(false);
});

test('添加：纯空格被拦截，长度不变', () => {
  const todos = sample();

  const next = addTodo(todos, '   ');

  expect(next.length).toBe(2);
  expect(next).not.toBe(todos);
});

test('添加：空字符串被拦截', () => {
  const todos = sample();

  expect(addTodo(todos, '').length).toBe(2);
});

test('添加：超过上限被拦截，刚好等于上限则写入', () => {
  const todos = sample();

  expect(addTodo(todos, 'a'.repeat(MAX_TEXT_LENGTH + 1)).length).toBe(2);
  expect(addTodo(todos, 'a'.repeat(MAX_TEXT_LENGTH)).length).toBe(3);
});

test('切换：命中的那项翻转，其余元素保持原引用', () => {
  const todos = sample();

  const next = toggleTodo(todos, 1);

  expect(next[0].completed).toBe(true);
  expect(next[1]).toBe(todos[1]);      // 没变的那项还是同一个对象
  expect(todos[0].completed).toBe(false); // 原对象没被就地改
});

test('切换：不存在的 id 安静返回，不崩溃', () => {
  const todos = sample();

  expect(() => toggleTodo(todos, 999)).not.toThrow();
  expect(toggleTodo(todos, 999).length).toBe(2);
});

test('删除：列表少一项，原数组不动', () => {
  const todos = sample();

  const next = removeTodo(todos, 1);

  expect(next.length).toBe(1);
  expect(next[0].id).toBe(2);
  expect(todos.length).toBe(2);
});

test('清空已完成：只留下未完成项', () => {
  const next = clearCompleted(sample());

  expect(next.length).toBe(1);
  expect(next[0].id).toBe(1);
});

test('localStorage 脏数据：坏记录被丢弃，好记录保留', () => {
  const raw = JSON.stringify([
    { id: 1, text: '合法', completed: false },
    { id: 'x', text: 'id 类型不对', completed: false },
    { id: 2, text: 123, completed: false },
    null,
  ]);

  const todos = parseTodos(raw);

  expect(todos.length).toBe(1);
  expect(todos[0].text).toBe('合法');
});

test('localStorage：非法 JSON 与空值一律返回空数组', () => {
  expect(parseTodos('{not json').length).toBe(0);
  expect(parseTodos(null).length).toBe(0);
});
