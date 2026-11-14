import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { NotFound } from './components/NotFound';
import { isHomePath } from './lib/route';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find #root element to mount the app');
}

const isHome = isHomePath(window.location.pathname, import.meta.env.BASE_URL);

createRoot(rootElement).render(<StrictMode>{isHome ? <App /> : <NotFound />}</StrictMode>);
