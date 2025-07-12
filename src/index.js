import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import AOS from 'aos';
import React from 'react';
import ReactDOM from 'react-dom/client';
// 1. Import BrowserRouter
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your App component with BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);