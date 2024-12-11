import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'; // Asegúrate de que la ruta sea correcta
import './api/axiosConfig.js';  // Importamos la configuración de Axios
import { CartProvider } from './context/CartContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Footer from './Screens/Footer.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <AuthProvider>
        <CartProvider>
          <App />
          <ToastContainer />
          <Footer />
        </CartProvider>
      </AuthProvider>
  </React.StrictMode>,
)
