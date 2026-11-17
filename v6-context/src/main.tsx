import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TodoApp from './components/TodoApp';
import { ThemeProvider } from './context/ThemeContext';
import './styles.css';

// 全项目唯一的 DOM 查找：React 的挂载入口，不是业务操作
const container = document.getElementById('root');
if (container === null) {
  throw new Error('页面缺少 #root 挂载容器');
}

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <TodoApp />
    </ThemeProvider>
  </StrictMode>,
);
