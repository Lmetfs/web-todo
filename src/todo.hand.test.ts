/**
 * 任务 2 · 手写单元测试（5 个用例）
 *
 * 写法照实验课第 16、17 页：显式 import test / expect，用例平铺，
 * 每个 test 内部自己新建数据，断言打到 text 与 completed 的具体值。
 */
import { test, expect } from 'vitest';
import { addTodo, toggleTodo, type Todo } from './todo';

// 用例 1 · 正常添加：长度 +1，内容与初始状态都对
test('正常添加：文本内容正确，completed 默认 false', () => {
  const todos: Todo[] = [];

  addTodo(todos, '学习TS');

  expect(todos.length).toBe(1);
  expect(todos[0].text).toBe('学习TS');
  expect(todos[0].completed).toBe(false);
});

// 用例 2 · 纯空格：trim 之后是空串，必须拦截
test('纯空格：拦截，数组长度不变', () => {
  const todos: Todo[] = [];

  addTodo(todos, '   ');

  expect(todos.length).toBe(0);
});

// 用例 3 · 空字符串：入口和纯空格不同（本来就没有内容），同样必须拦截
test('空字符串：拦截，数组长度不变', () => {
  const todos: Todo[] = [];

  addTodo(todos, '');

  expect(todos.length).toBe(0);
});

// 用例 4 · 正常切换：目标翻转，其他任务不受牵连
test('切换完成状态：目标翻转，其他任务不受影响', () => {
  const todos: Todo[] = [
    { id: 1, text: '学习TS', completed: false },
    { id: 2, text: '写周报', completed: true },
  ];

  toggleTodo(todos, 1);

  expect(todos[0].completed).toBe(true);
  expect(todos[1].completed).toBe(true); // 第二条本来就是 true，不能被连带改掉
  expect(todos[1].id).toBe(2);
});

// 用例 5 · 不存在的 ID：属于契约的一部分，安静返回、不抛错
test('不存在的 ID：不崩溃，长度与内容都不变', () => {
  const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];

  expect(() => toggleTodo(todos, 999)).not.toThrow();
  expect(todos.length).toBe(1);
  expect(todos[0].completed).toBe(false);
});
