import { useNavigate } from 'react-router-dom';
import '../Css/NotAuthorized.css'; // Importa el archivo CSS

const NotAuthorized = () => {
    const navigate = useNavigate();

    // Función para manejar la navegación hacia atrás
    const handleGoBack = () => {
        navigate('/home'); // Regresa a la página anterior
    };

    return (
        <div className="container">
            <h1 className="title">Acceso Denegado</h1>
            <p className="message">No tienes permiso para acceder a esta página.</p>
            <button className="button" onClick={handleGoBack}>
                Regresar a la página anterior
            </button>
        </div>
    );
};

export default NotAuthorized;

