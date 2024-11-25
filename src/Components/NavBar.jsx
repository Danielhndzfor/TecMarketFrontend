import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getUser, logout } from '../api/auth';
import { User, ShoppingCart, Menu, LogOut } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { CartContext } from '../context/CartContext';

function NavBar() {
    const { cart } = useContext(CartContext);
    const [role, setRole] = useState(null); // Inicialmente null
    const [userId, setUserId] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUserId(userData._id);
                setRole(userData.role); // Una vez cargado, role tendrá su valor real
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
            }
        };

        fetchUser();
    }, []);

    const handleBecomeSeller = () => {
        navigate('/convertirse-vendedor');
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Error durante la salida:', error);
        }
    };

    const NavItems = () => (
        <>
            {role === 'comprador' && (
                <>
                    <Link to="/home" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/home' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Inicio</Link>
                    <Link to="/productos" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/productos' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Productos</Link>
                    <Link to="/historial" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/historial' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Mis Compras</Link>
                </>
            )}
            {role === 'vendedor' && (
                <>
                    <Link to="/home" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/home' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Inicio</Link>
                    <Link to="/productos" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/productos' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Productos</Link>
                    <Link to="/dashboard" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</Link>
                    <Link to="/historial" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/historial' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Mis Compras</Link>
                </>
            )}
            {role === 'admin' && (
                <>
                    <Link to="/admin" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</Link>
                    <Link to="/users" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/users' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Usuarios</Link>
                    <Link to="/products" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/products' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Productos</Link>
                    <Link to="/orders" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/orders' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Órdenes</Link>
                    <Link to="/categories" className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/categories' ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}>Categorías</Link>
                </>
            )}
        </>
    );

    const getTotalTypesOfProducts = () => {
        const uniqueProductTypes = new Set(cart.items.map(item => item.productId));
        return uniqueProductTypes.size;
    };



    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-40">
                    <div className="flex items-center">
                        <img className="h-20 w-auto" src={Logo} alt="Logo" />
                        <div className="hidden md:ml-6 md:flex md:space-x-8">
                            {role && <NavItems />} {/* Solo muestra el menú si role ya está cargado */}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Link to="/cart" className="relative p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Carrito</span>
                            <ShoppingCart className="h-6 w-6" />
                            {getTotalTypesOfProducts() > 0 && (
                                <span className="absolute top-0 right-0 h-5 w-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {getTotalTypesOfProducts()}
                                </span>
                            )}
                        </Link>

                        <div className="ml-3 relative">
                            <div>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    id="user-menu"
                                    aria-haspopup="true"
                                >
                                    <span className="sr-only">Abrir menú de usuario</span>
                                    <User className="h-8 w-8 rounded-full" />
                                </button>
                            </div>
                            {isProfileMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Perfil</Link>
                                    {role === 'comprador' && ( // Mostrar solo si el rol es comprador
                                        <Link
                                            to="/convertirse-vendedor"
                                            onClick={handleBecomeSeller}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            role="menuitem"
                                        >
                                            Quiero vender
                                        </Link>
                                    )}
                                    <a
                                        href="#"
                                        onClick={handleLogout}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        <LogOut className="inline mr-2 h-4 w-4" />
                                        Cerrar sesión
                                    </a>
                                </div>
                            )}

                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray ```javascript
                                -400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="sr-only">Abrir menú principal</span>
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavItems />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default NavBar;