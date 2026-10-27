/**
 * 任务 3 ③ · 修补后的测试
 *
 * 分两块：
 *   ① 有效性修补 —— 把 AI 那两条无效断言换成能「改错就变红」的断言
 *   ② 边界修补 —— 对照 9 维度，补上 AI 漏掉的 空值 / 越界 / 类型
 */
import { describe, it, expect } from 'vitest';
import { addTodo, toTodoId, MAX_TEXT_LENGTH, type Todo } from './todo';

describe('① 有效性修补（替换 AI 的弱断言与写反的期望值）', () => {
  it('添加一条任务：断言文本内容，而不是 toBeDefined', () => {
    const todos: Todo[] = [];

    addTodo(todos, '学习TS');

    expect(todos[0].text).toBe('学习TS');
    expect(todos[0].completed).toBe(false);
  });

  it('拒绝空字符串：期望长度是 0，不是 1', () => {
    const todos: Todo[] = [];

    addTodo(todos, '');

    expect(todos.length).toBe(0);
  });
});

describe('② 边界修补（9 维度查漏）', () => {
  // 维度 1（空值）
  it('维度1 空值：传 null 应被拦截', () => {
    const todos: Todo[] = [];

    // 运行时模拟脏数据：用 Reflect.apply 绕过编译期类型，不使用 as any
    Reflect.apply(addTodo, undefined, [todos, null]);

    expect(todos.length).toBe(0);
  });

  // 维度 4（越界）
  it('维度4 越界：超过上限的文本被拦截', () => {
    const todos: Todo[] = [];
    const tooLong = 'a'.repeat(MAX_TEXT_LENGTH + 1);

    addTodo(todos, tooLong);

    expect(todos.length).toBe(0);
  });

  it('维度4 越界：刚好等于上限的文本应当写入', () => {
    const todos: Todo[] = [];
    const exactly = 'a'.repeat(MAX_TEXT_LENGTH);

    addTodo(todos, exactly);

    expect(todos.length).toBe(1);
    expect(todos[0].text.length).toBe(MAX_TEXT_LENGTH);
  });

  // 维度 3（类型）
  it('维度3 类型：dataset 的脏 id 一律返回 null，合法 id 正确转换', () => {
    expect(toTodoId('123abc')).toBeNull();  // 转换得 NaN
    expect(toTodoId('1.5')).toBeNull();     // 不是安全整数
    expect(toTodoId('')).toBeNull();        // Number('') 是 0，会被 <= 0 挡掉
    expect(toTodoId(undefined)).toBeNull(); // 元素上没有 data-id
    expect(toTodoId('-5')).toBeNull();      // 负数

    expect(toTodoId('1001')).toBe(1001);
  });

  // 维度 9（安全与注入防范）
  it('维度9 安全：脚本标签按纯文本原样保存，数据层不改写内容', () => {
    const todos: Todo[] = [];
    const raw = '<img src=x onerror=alert(1)>';

    addTodo(todos, raw);

    // 分层约定：数据层只负责「存进去什么就是什么」，
    // 编码交给渲染层的 textContent（W6 已定）。
    // 这里若先转义一次、渲染层再转一次，就会变成双转义。
    expect(todos.length).toBe(1);
    expect(todos[0].text).toBe(raw);
  });
});
