import React from 'react';

function Footer() {
    return (
        <footer style={footerStyle}>
            <p style={textStyle}>© 2024 TecMarket. Todos los derechos reservados.</p>
        </footer>
    );
}

const footerStyle = {
    backgroundColor: '#28a745', // Verde minimalista
    color: '#fff',
    textAlign: 'center',
    padding: '10px 20px',
    position: 'fixed', // Fija el footer en la parte inferior
    bottom: '0', // Se asegura de que esté en la parte inferior de la ventana
    left: '0',
    width: '100%',
    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 100, // Asegura que el footer quede por encima de otros elementos si es necesario
};

const textStyle = {
    margin: 0,
    fontSize: '14px',
};

export default Footer;
