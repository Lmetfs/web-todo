import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AiFixedApp from './ai-fixed';

const el = document.getElementById('root');
if (el !== null)
  createRoot(el).render(
    <StrictMode>
      <AiFixedApp />
    </StrictMode>,
  );
