import TodoItem from './TodoItem';
import type { Todo } from '../lib/todo';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

/**
 * 只负责“把数组铺成列表”，不持有任何状态。
 * key 用 todo.id 而不是下标：删除中间一项时，下标会整体前移，React 会认错人。
 */
export default function TodoList({ todos, onToggle, onRemove }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="empty">还没有任务，先在上面加一条。</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onRemove={onRemove} />
      ))}
    </ul>
  );
}
