/**
 * 任务 3 · AI 对靶子的修复结果（原样保留，用于三层审查）
 *
 * 修掉的两点：
 *   ① 读取挪进 useState 的惰性初始化 —— 不再有「先渲染空数组、再 setTodos」的中间态；
 *   ② 只剩一个写入 Effect —— 不会出现两个 Effect 抢着写。
 * 残留的一点（审查时才发现）：JSON.parse 外面套了 try/catch，但没验「解析出来是不是数组」，
 * 也没验元素结构；类型上用 as Todo[] 把编译器哄过去了。
 */
import { useEffect, useState } from 'react';
import type { Todo } from '../src/lib/todo';

function loadTodos(): Todo[] {
  const saved = localStorage.getItem('todos');
  if (!saved) return [];
  try {
    return JSON.parse(saved) as Todo[];
  } catch {
    return [];
  }
}

export default function AiFixedApp() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);

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
