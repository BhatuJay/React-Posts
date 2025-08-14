import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store.js'
import { ToastContainer } from 'react-toastify'
import { inject } from "@vercel/analytics";

inject(); // Initialize Vercel Analytics

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <ToastContainer position="top-center" theme="colored" autoClose={1000} />
  </StrictMode>,
)