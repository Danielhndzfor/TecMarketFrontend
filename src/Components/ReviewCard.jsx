// src/Components/ReviewCard.jsx
import React from 'react';
import '../Css/ReviewCard.css'; // Asegúrate de agregar estilos para este componente

const ReviewCard = ({ review }) => {
    return (
        <div className="review-card">
            <h3>{review.title}</h3>
            <p>{review.comment}</p>
            <p><strong>Rating:</strong> {review.rating}</p>
        </div>
    );
};

export default ReviewCard;
