import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider

import Login from './Screens/Login';
import Register from './Screens/Register';
import Home from './Screens/Home';
import CreateProduct from './Screens/Vendedor/CreateProduct';
import Inventory from './Screens/Vendedor/Inventario';
import ProductDetail from './Screens/Comprador/ProductDetails';
import ChangeRole from './Screens/Admin/ChangeRole';
import CreateCategory from './Screens/Admin/CreateCategory';
import Cart from './Screens/Comprador/Cart';
import Logout from './Screens/Logout';
import NotAuthorized from './Screens/NotAuthorized';

function App() {
  return (
    <AuthProvider> {/* Rodea la app con AuthProvider */}
      <Router>
        <TitleUpdater />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/not-authorized" element={<NotAuthorized />} />

          <Route
            path="/home"
            element={
              <PrivateRoute
                element={Home}
                roles={['admin', 'vendedor', 'comprador']} // Admin, vendedor y comprador tienen acceso
              />
            }
          />



          <Route
            path="/create-product"
            element={
              <PrivateRoute
                element={CreateProduct}
                roles={['admin', 'vendedor']} // Solo vendedores pueden acceder
              />
            }
          />

          <Route
            path="/inventory"
            element={
              <PrivateRoute
                element={Inventory}
                roles={['admin', 'vendedor']} // Admins y vendedores pueden acceder
              />
            }
          />

          <Route path="/product/:id" element={<ProductDetail />} /> {/* Ruta abierta */}
          <Route
            path="/cart"
            element={
              <PrivateRoute
                element={Cart}
                roles={['admin', 'vendedor', 'comprador']} // Solo compradores pueden acceder
              />
            }
          />

          <Route
            path="/change-role"
            element={
              <PrivateRoute
                element={ChangeRole}
                roles={['admin', 'vendedor', 'comprador']} // Solo admins pueden acceder
              />
            }
          />

          <Route
            path="/create-category"
            element={
              <PrivateRoute
                element={CreateCategory}
                roles={['admin']} // Solo admins pueden acceder
              />
            }
          />

          <Route path="/logout" element={<Logout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = 'Login';
        break;
      default:
        document.title = 'Login';
    }
  }, [location]);

  return null;
}

export default App;

