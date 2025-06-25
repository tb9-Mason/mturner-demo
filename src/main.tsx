import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Footer, Header } from './common/components/layout';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex flex-col min-h-screen">
      <Header />
      <App />
      <Footer />
    </div>
  </StrictMode>,
);
