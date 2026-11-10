import type { Todo } from '../lib/todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

/** 列表项：自己不改数据，只把“哪个 id 要干什么”往上报 */
export default function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className={todo.completed ? 'todo-item done' : 'todo-item'}>
      <span className="todo-text" onClick={() => onToggle(todo.id)}>
        {todo.text}
      </span>
      <span className="todo-actions">
        <button type="button" className="btn small" onClick={() => onToggle(todo.id)}>
          {todo.completed ? '取消完成' : '完成'}
        </button>
        <button type="button" className="btn small danger" onClick={() => onRemove(todo.id)}>
          删除
        </button>
      </span>
    </li>
  );
}
