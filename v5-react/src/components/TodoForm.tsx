import { useState, type FormEvent } from 'react';

export interface TodoFormProps {
  /** 提交一条新任务：文本由子组件收集，合法性由父组件的纯函数判定 */
  onAdd: (text: string) => void;
}

/** 输入框的“草稿文本”属于自己，没必要提到父组件去 */
export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim() === '') return;
    onAdd(text);
    setText('');
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        type="text"
        value={text}
        placeholder="要做什么？回车或点添加"
        maxLength={120}
        onChange={event => setText(event.target.value)}
      />
      <button className="btn primary" type="submit">
        添加
      </button>
    </form>
  );
}
