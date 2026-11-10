import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import {
  addTodo,
  clearCompleted,
  parseStoredTodos,
  removeTodo,
  STORAGE_KEY,
  toggleTodo,
  type Todo,
} from '../lib/todo';

/**
 * 唯一的“有状态”组件：todos 在这里，向下传数据、向上接事件。
 * 三个操作一律走「纯函数 + setState 函数式更新」，组件里不出现任何数组原地修改。
 */
export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(() =>
    parseStoredTodos(localStorage.getItem(STORAGE_KEY)),
  );

  // 持久化：State 变了才写一次，不在事件处理里零散地写
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 双轨验证用：每次 State 变化都把数组打到控制台，和页面列表逐项对照
  useEffect(() => {
    console.log('[state] todos =', todos);
  }, [todos]);

  const handleAdd = (text: string) => setTodos(prev => addTodo(prev, text));
  const handleToggle = (id: number) => setTodos(prev => toggleTodo(prev, id));
  const handleRemove = (id: number) => setTodos(prev => removeTodo(prev, id));
  const handleClearCompleted = () => setTodos(prev => clearCompleted(prev));

  const remaining = todos.filter(todo => !todo.completed).length;
  const finished = todos.length - remaining;

  return (
    <main className="app">
      <header className="app-header">
        <h1>Todo</h1>
        <p className="app-sub">V4.0 · React 组件化 + State 驱动</p>
      </header>

      <TodoForm onAdd={handleAdd} />

      <TodoList todos={todos} onToggle={handleToggle} onRemove={handleRemove} />

      <footer className="app-footer">
        <span className="counter">
          共 {todos.length} 项 · 待办 {remaining} · 已完成 {finished}
        </span>
        <button
          type="button"
          className="btn ghost"
          onClick={handleClearCompleted}
          disabled={finished === 0}
        >
          清空已完成
        </button>
      </footer>
    </main>
  );
}
