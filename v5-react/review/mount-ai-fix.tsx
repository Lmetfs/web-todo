import { createRoot } from 'react-dom/client';
import TodoApp from './ai-fix';

const el = document.getElementById('root');
if (el !== null) createRoot(el).render(<TodoApp />);
