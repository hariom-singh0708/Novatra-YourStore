import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'aos/dist/aos.css';          // AOS
import 'animate.css';               // Animate.css
import 'react-toastify/dist/ReactToastify.css'; // React Toastify

import AOS from 'aos';

AOS.init({
  duration: 800,
  offset: 120,
  easing: 'ease-in-out',
  once: true,
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
   
  </React.StrictMode>
);
