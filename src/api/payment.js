// api/payment.js
import { API_URL } from '../config'; // Importa el valor de API_URL desde config.js

export async function createPayment(cartId) {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch( `${API_URL}/api/payments/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,

            },
            body: JSON.stringify({ cartId }),
        });

        if (!response.ok) {
            throw new Error('Error al crear el pago');
        }

        const data = await response.json();

        if (data.init_point) {
            window.location.href = data.init_point; // Redirigir a la URL de pago
        } else {
            throw new Error('No se pudo obtener el init_point de la respuesta');
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

