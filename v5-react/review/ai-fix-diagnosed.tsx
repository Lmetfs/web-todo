/**
 * 诊断对照：只把 handleToggle 的收尾从 setTodos(todos) 改成 setTodos([...todos])，
 * 其余一行不动。用来验证「点击没反应」到底是不是引用相同导致 React bail out。
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
    setTodos([...todos]);
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
