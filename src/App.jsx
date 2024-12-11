import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import PrivateRoute from './PrivateRoute';

import Login from './Screens/Login';
import Register from './Screens/Register';
import Home from './Screens/Home';
import Historial from './Screens/Comprador/Historial';
import CreateProduct from './Screens/Vendedor/CreateProduct';
import Inventory from './Screens/Vendedor/Inventario';
import ProductDetail from './Screens/Comprador/ProductDetails';
import ChangeRole from './Screens/Admin/ChangeRole';
import CreateCategory from './Screens/Admin/CreateCategory';
import Cart from './Screens/Comprador/Cart';
import Logout from './Screens/Logout';
import NotAuthorized from './Screens/NotAuthorized';
import DashboardAdmin from './Screens/Admin/DashboardAdmin';
import Products from './Screens/Admin/Products';
import Users from './Screens/Admin/Users';
import Orders from './Screens/Admin/Orders';
import Categories from './Screens/Admin/Categories';
import Productos from './Screens/Comprador/Productos';
import CartPrueba from './Screens/Comprador/CartPrueba';

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

        <Route path="/cart-prueba" element={<CartPrueba />} />  

        {/* Rutas para roles admin, vendedor y comprador */}
        <Route
          path="/home"
          element={
            <PrivateRoute
              element={Home}
              roles={['admin', 'vendedor', 'comprador']}
            />
          }
        />



        <Route
          path='/historial'
          element={
            <PrivateRoute
              element={Historial}
              roles={['admin', 'vendedor', 'comprador']}
            />
          }
        />

        <Route
          path='/productos'
          element={
            <PrivateRoute
              element={Productos}
              roles={['admin', 'vendedor', 'comprador']}
            />
          }
        />

        {/* Rutas para roles admin y vendedor */}
        <Route
          path="/create-product"
          element={
            <PrivateRoute
              element={CreateProduct}
              roles={['admin', 'vendedor']}
            />
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute
              element={Inventory}
              roles={['admin', 'vendedor']}
            />
          }
        />

        {/* Ruta abierta para detalles del producto */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Ruta para compradores */}
        <Route
          path="/cart"
          element={
            <PrivateRoute
              element={Cart}
              roles={['admin', 'vendedor', 'comprador']}
            />
          }
        />

        {/* Ruta para convertirse en vendedor */}
        <Route
          path="/convertirse-vendedor"
          element={
            <PrivateRoute
              element={SellerForm}
              roles={['comprador', 'admin']}
            />
          }
        />

        {/* Ruta solo para admins */}
        <Route
          path="/change-role"
          element={
            <PrivateRoute
              element={ChangeRole}
              roles={['admin']}
            />
          }
        />

        {/* Dashboard para vendedor y admin */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              element={Dashboard}
              roles={['vendedor', 'admin']}
            />
          }
        />

        {/* Perfil para todos los usuarios autenticados */}
        <Route
          path="/profile"
          element={
            <PrivateRoute
              element={Profile}
              roles={['admin', 'vendedor', 'comprador']}
            />
          }
        />

        {/* Crear categoría solo para admin */}
        <Route
          path="/create-category"
          element={
            <PrivateRoute
              element={CreateCategory}
              roles={['admin']}
            />
          }
        />



        {/* Dashboard de administrador */}
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={DashboardAdmin}
              roles={['admin']}
            />
          }
        />

        {/* Inventario total de usuarios */}
        <Route
          path="/products"
          element={
            <PrivateRoute
              element={Products}
              roles={['admin']}
            />
          }
        />

        {/* Lista de usuarios */}
        <Route
          path="/users"
          element={
            <PrivateRoute
              element={Users}
              roles={['admin']}
            />
          }
        />

        {/* Lista de órdenes */}
        <Route
          path="/orders"
          element={
            <PrivateRoute
              element={Orders}
              roles={['admin']}
            />
          }
        />

        <Route
          path='/categories'
          element={
            <PrivateRoute
              element={Categories}
              roles={['admin']}
            />
          }
        />



        {/* Logout (sin restricción de rol) */}
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
      case '/register':
        document.title = 'Registro';
        break;
      case '/home':
        document.title = 'Inicio';
        break;
      case '/create-product':
        document.title = 'Crear Producto';
        break;
      case '/inventory':
        document.title = 'Inventario';
        break;
      case '/product/:id':
        document.title = 'Detalles del Producto';
        break;
      case '/cart':
        document.title = 'Carrito de Compras';
        break;
      case '/convertirse-vendedor':
        document.title = 'Convertirse en Vendedor';
        break;
      case '/change-role':
        document.title = 'Cambiar Roles';
        break;
      case '/dashboard':
        document.title = 'Dashboard Vendedor';
        break;
      case '/profile':
        document.title = 'Perfil';
        break;
      case '/create-category':
        document.title = 'Crear Categoría';
        break;
      case '/admin':
        document.title = 'Dashboard Admin';
        break;
      case '/logout':
        document.title = 'Cerrar Sesión';
        break;
      case '/not-authorized':
        document.title = 'No Autorizado';
        break;
      default:
        document.title = 'Aplicación';
    }
  }, [location]);

  return null;
}

export default App;

