import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    console.log("Estado del usuario en PrivateRoute:", user);

    if (!user) {
        console.log("Usuario no autenticado, redirigiendo a login...");
        return <Navigate to="/" />; // Redirige a login solo si loading es false y no hay usuario
    }

    if (roles && !roles.includes(user.role)) {
        console.log(`El usuario con rol ${user.role} no está autorizado, redirigiendo a /not-authorized`);
        return <Navigate to="/not-authorized" />;
    }

    return <Element {...rest} />;
};


export default PrivateRoute;
