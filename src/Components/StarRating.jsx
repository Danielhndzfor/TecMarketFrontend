import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa'; // Usamos iconos de estrellas
import '../Css/StarRating.css';

const StarRating = ({ rating, setRating }) => {
    const [hover, setHover] = useState(null); // Estado para el hover

    return (
        <div className="star-rating">
            {[...Array(5)].map((star, index) => {
                const currentRating = index + 1; // El índice empieza en 0, así que sumamos 1

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={currentRating}
                            onClick={() => setRating(currentRating)} // Establecemos el rating cuando se hace clic
                            style={{ display: 'none' }} // Ocultamos el radio button
                        />
                        <FaStar
                            size={24}
                            color={currentRating <= (hover || rating) ? '#ffd700' : '#e4e5e9'} // Color de las estrellas
                            onMouseEnter={() => setHover(currentRating)} // Cambiamos el estado de hover
                            onMouseLeave={() => setHover(null)} // Volvemos a estado normal al salir del hover
                            style={{ cursor: 'pointer', marginRight: '5px' }}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;
