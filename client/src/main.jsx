// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { MessageProvider } from './context/MessageContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SocketProvider>
        <MessageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </MessageProvider>
      </SocketProvider>
    </AuthProvider>
  </StrictMode>
);