/**
 * 事件委托接线（W8 的 li 循环绑定 → 父容器统一接管）
 * 唯一与 DOM 交互的地方，id 一律走 readTodoId 的「先收窄、再转换、后校验」。
 */
import {
  addTodo,
  toggleTodo,
  removeTodo,
  clearCompleted,
  parseStoredTodos,
  readTodoId,
  type Todo,
} from './todo.js';

const STORAGE_KEY = 'todos';

/** 找不到元素就直接抛错，返回类型是非空元素，避免后续到处判空 */
function mustFind<T extends Element>(selector: string, ctor: new () => T): T {
  const el = document.querySelector(selector);
  if (!(el instanceof ctor)) {
    throw new Error(`页面缺少必需元素：${selector}`);
  }
  return el;
}

const list = mustFind('#todo-list', HTMLElement);
const input = mustFind('#todo-input', HTMLInputElement);
const addBtn = document.querySelector('#add-btn');
const clearBtn = document.querySelector('#clear-btn');

let todos: Todo[] = parseStoredTodos(localStorage.getItem(STORAGE_KEY));

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
    text.textContent = todo.text; // 纯文本，杜绝 XSS

    const del = document.createElement('button');
    del.dataset.action = 'delete';
    del.textContent = '删除';

    li.append(text, del);
    list.appendChild(li);
  });
}

// 一个监听器处理所有 li：删除 / 其余（切换）
list.addEventListener('click', event => {
  const id = readTodoId(event.target);
  if (id === null) return;

  if (!(event.target instanceof HTMLElement)) return;
  const delBtn = event.target.closest('[data-action="delete"]');

  if (delBtn !== null) {
    removeTodo(todos, id);
  } else {
    toggleTodo(todos, id);
  }
  save();
  render();
});

addBtn?.addEventListener('click', () => {
  addTodo(todos, input.value);
  input.value = '';
  input.focus();
  save();
  render();
});

clearBtn?.addEventListener('click', () => {
  clearCompleted(todos);
  save();
  render();
});

render();
