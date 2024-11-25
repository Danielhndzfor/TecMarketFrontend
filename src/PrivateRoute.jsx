import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ element: Element, roles, ...rest }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;


    if (!user) {
        return <Navigate to="/" />; // Redirige a login solo si loading es false y no hay usuario
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/not-authorized" />;
    }

    return <Element {...rest} />;
};


export default PrivateRoute;
