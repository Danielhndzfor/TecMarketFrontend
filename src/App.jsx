import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PrivateRoute from './PrivateRoute';

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

import SellerForm from './Screens/Vendedor/Convertirse-vendedor';
import Profile from './Screens/Profile';
import Dashboard from './Screens/Vendedor/Dashboard';

function App() {
  return (
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
            path="/convertirse-vendedor"
            element={
              <PrivateRoute
                element={SellerForm}
                roles={['comprador', 'admin']} // Solo compradores pueden acceder
              />
            } // Solo compradores pueden acceder
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
            path="/dashboard"
            element={
              <PrivateRoute
                element={Dashboard}
                roles={['vendedor', 'admin']} // Solo vendedores pueden acceder
              />
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute
                element={Profile}
                roles={['admin', 'vendedor', 'comprador']} // Solo usuarios autenticados pueden acceder
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

