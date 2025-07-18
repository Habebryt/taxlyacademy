import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'aos/dist/aos.css';
import AOS from 'aos';
import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Import ONLY ONE router. HashRouter is best for GitHub Pages.
import { HashRouter } from 'react-router-dom';
import App from './App';

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* 2. Wrap your App component with the single router */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);