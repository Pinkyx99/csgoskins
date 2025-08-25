import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { SiteEventsProvider } from './contexts/SiteEventsContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <UserProvider>
      <SiteEventsProvider>
        <App />
      </SiteEventsProvider>
    </UserProvider>
  </React.StrictMode>
);