/**
 * 任务 3 · AI 对“假 React”靶子代码的修复结果（原样保留，用于审查）
 *
 * 只作审查对象，不参与正式构建，也不被 App 引用。
 */
import { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  function handleAdd() {
    if (text.trim() === '') return;
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos([...todos, newTodo]);
    setText('');
  }

  function handleToggle(id) {
    todos.map(t => {
      if (t.id === id) {
        t.completed = !t.completed;
      }
    });
    setTodos(todos);
  }

  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAdd}>添加</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} onClick={() => handleToggle(todo.id)}>
            {todo.text} {todo.completed ? '✔' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
