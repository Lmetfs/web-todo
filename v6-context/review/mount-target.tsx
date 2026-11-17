import { createRoot } from 'react-dom/client';
import TargetApp from './target';

const el = document.getElementById('root');
if (el !== null) createRoot(el).render(<TargetApp />);
