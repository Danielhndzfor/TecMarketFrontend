import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Ajusta la ruta según sea necesario

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    console.log("Estado del usuario en PrivateRoute:", user);

    if (!user) {
        console.log("Usuario no autenticado, redirigiendo a login...");
        return <Navigate to="/" />;
    }

    if (roles && !roles.includes(user.role)) {
        console.log(`El usuario con rol ${user.role} no está autorizado, redirigiendo a /not-authorized`);
        return <Navigate to="/not-authorized" />;
    }

    return <Element {...rest} />;
};

export default PrivateRoute;

