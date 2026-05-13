import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './Context/AppContext.jsx';
import './i18n';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
   
      <BrowserRouter>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </BrowserRouter>
   
  </StrictMode>
);

reportWebVitals();
