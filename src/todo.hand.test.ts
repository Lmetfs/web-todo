/**
 * 任务 2 · 手写单元测试（5 个用例，对照实验课第 10 页）
 *
 * 两条自我约束：
 * - 每个 test 内部新建数据，不写模块级共享变量（否则第二条用例会被污染）。
 * - 断言打到具体业务结果（text / completed），不能只断言 length。
 */
import { describe, it, expect } from 'vitest';
import { addTodo, toggleTodo, type Todo } from './todo';

describe('addTodo', () => {
  // 用例 1 · 正常添加
  it('正常添加：长度 +1，且第一条的文本等于输入', () => {
    const todos: Todo[] = [];

    addTodo(todos, '学习TS');

    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe('学习TS');
    expect(todos[0].completed).toBe(false);
  });

  // 用例 2 · 纯空格
  it('纯空格：拦截，长度不变', () => {
    const todos: Todo[] = [];

    addTodo(todos, '   ');

    expect(todos.length).toBe(0);
  });

  // 用例 3 · 空字符串
  it('空字符串：拦截，长度不变', () => {
    const todos: Todo[] = [];

    addTodo(todos, '');

    expect(todos.length).toBe(0);
  });
});

describe('toggleTodo', () => {
  // 用例 4 · 正常切换
  it('正常切换：目标 completed 翻转，其他任务不受影响', () => {
    const todos: Todo[] = [
      { id: 1, text: '学习TS', completed: false },
      { id: 2, text: '写周报', completed: true },
    ];

    toggleTodo(todos, 1);

    expect(todos[0].completed).toBe(true);
    expect(todos[1].completed).toBe(true); // 第二条本来就是 true，不能被连带改掉
    expect(todos[1].id).toBe(2);
  });

  // 用例 5 · 不存在的 ID
  it('不存在的 ID：不崩溃，长度与内容都不变', () => {
    const todos: Todo[] = [
      { id: 1, text: '学习TS', completed: false },
    ];

    expect(() => toggleTodo(todos, 999)).not.toThrow();
    expect(todos.length).toBe(1);
    expect(todos[0].completed).toBe(false);
  });
});
