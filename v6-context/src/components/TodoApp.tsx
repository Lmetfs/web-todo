import { useEffect, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import ThemeToggle from './ThemeToggle';
import { addTodo, clearCompleted, removeTodo, toggleTodo, type Todo } from '../lib/todo';
import { loadTodos, saveTodos } from '../lib/storage';

/**
 * 唯一的“有状态”组件：todos 在这里，向下传数据、向上接事件。
 * 持久化两句话：启动时用惰性初始化读一次，之后用单个 Effect 写。
 */
export default function TodoApp() {
  // 惰性初始化：传函数而不是调函数，读盘只在首次挂载时发生一次
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

  // 单 Effect 写入：依赖只有 todos，State 变了才写，不在事件处理里零散地写
  useEffect(() => {
    saveTodos(todos);
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
        <div className="app-title">
          <h1>Todo</h1>
          <p className="app-sub">V4.0 · React 组件化 + Context 主题 + Effect 持久化</p>
        </div>
        <ThemeToggle />
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
