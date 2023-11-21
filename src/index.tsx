import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './components/app/app';
import store, { persistor } from './store/store';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store} >
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
