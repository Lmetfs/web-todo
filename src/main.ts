import {
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  parseStoredTodos,
  readTodoId,
  type Todo,
} from './todo';

const STORAGE_KEY = 'todos';

/** 找不到元素就直接抛错，返回非空元素，后续不必到处判空 */
function mustFind<T extends Element>(selector: string, ctor: new () => T): T {
  const el = document.querySelector(selector);
  if (!(el instanceof ctor)) {
    throw new Error(`页面缺少必需元素：${selector}`);
  }
  return el;
}

const list = mustFind('#todo-list', HTMLElement);
const input = mustFind('#todo-input', HTMLInputElement);
const addBtn = mustFind('#add-btn', HTMLButtonElement);
const clearBtn = mustFind('#clear-btn', HTMLButtonElement);

const todos: Todo[] = parseStoredTodos(localStorage.getItem(STORAGE_KEY));

function save(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render(): void {
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = String(todo.id);
    if (todo.completed) li.classList.add('done');

    const text = document.createElement('span');
    text.className = 'todo-text';
    text.textContent = todo.text;

    const del = document.createElement('button');
    del.dataset.action = 'delete';
    del.textContent = '删除';

    li.append(text, del);
    list.appendChild(li);
  });
}

/** 只判断这次点击落在哪个操作上，不做业务，保持单一职责 */
function actionOf(target: EventTarget | null): 'delete' | 'toggle' {
  if (!(target instanceof HTMLElement)) return 'toggle';
  return target.closest('[data-action="delete"]') !== null ? 'delete' : 'toggle';
}

// 一个监听器处理所有 li：识别 id → 分流操作 → 保存 → 重渲染
list.addEventListener('click', event => {
  const id = readTodoId(event.target);
  if (id === null) return;

  if (actionOf(event.target) === 'delete') {
    removeTodo(todos, id);
  } else {
    toggleTodo(todos, id);
  }
  save();
  render();
});

addBtn.addEventListener('click', () => {
  addTodo(todos, input.value);
  input.value = '';
  input.focus();
  save();
  render();
});

clearBtn.addEventListener('click', () => {
  clearCompleted(todos);
  save();
  render();
});

render();
