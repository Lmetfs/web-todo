/**
 * 任务 3 · 靶子：从模板原样搬来的「有问题」的持久化写法
 *
 * 两个 Effect：
 *   ① 挂载后读一次 localStorage；
 *   ② todos 变化就写一次。
 * 看起来没问题，但 ① 的 setTodos 是异步的，② 在首次挂载时拿到的还是初始的 []……
 * 本文件只用于验证，不参与正式构建。
 */
import { useEffect, useState } from 'react';
import type { Todo } from '../src/lib/todo';

export default function TargetApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  return (
    <div>
      <p id="count">条目数：{todos.length}</p>
      <ul id="list">
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </div>
  );
}
