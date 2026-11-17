import { useTheme } from '../context/ThemeContext';

/** 消费者 ①：只认 Context，不接任何 props —— 放在哪层都能拿到当前主题 */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === 'light' ? '深色' : '浅色';

  return (
    <button
      type="button"
      className="btn ghost theme-toggle"
      onClick={toggleTheme}
      aria-label={`切换到${nextLabel}主题`}
      title={`当前：${theme === 'light' ? '浅色' : '深色'}主题`}
    >
      切到{nextLabel}
    </button>
  );
}
