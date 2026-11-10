import { createRoot } from 'react-dom/client';
import TodoApp from './ai-fix-diagnosed';

const el = document.getElementById('root');
if (el !== null) createRoot(el).render(<TodoApp />);
