import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ScheduleProvider } from "./components/schedule/ScheduleContext";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ScheduleProvider>
        <App />
      </ScheduleProvider>
  </StrictMode>,
)
