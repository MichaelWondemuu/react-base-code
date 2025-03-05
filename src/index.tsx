import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // TailwindCSS or custom styles
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';  // Correctly import the store
import { MantineProvider } from '@mantine/core';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Correctly pass the store here */}
      <MantineProvider withGlobalStyles withNormalizeCSS>
        
        <App />
      </MantineProvider>
    </Provider>
  </React.StrictMode>
);
