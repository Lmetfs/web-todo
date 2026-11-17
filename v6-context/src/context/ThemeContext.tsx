import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { loadTheme, saveTheme, type Theme } from '../lib/storage';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

/**
 * 默认值给 null：谁忘了套 Provider，useTheme 会当场抛错，
 * 而不是拿到一个「看起来能用但永远切不动」的假对象。
 */
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 惰性初始化：主题也从 localStorage 读，刷新不闪回浅色
  const [theme, setTheme] = useState<Theme>(loadTheme);

  // 主题落到 <html data-theme>，样式表靠这个属性切变量
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // value 必须用 useMemo 稳住：否则每次渲染都是新对象，所有消费者都会白重渲染
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useTheme 必须在 <ThemeProvider> 内部使用');
  }
  return ctx;
}
