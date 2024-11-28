import React, { useState } from "react";
import "../Css/InfoCard.css"; // Estilos para la animación

function InfoCard({ title, value, details }) {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className={`info-card ${flipped ? "flipped" : ""}`} onClick={() => setFlipped(!flipped)}>
            <div className="front">
                <h4>{title}</h4>
                <p>{value}</p>
            </div>
            <div className="back">
                <h4>Detalles</h4>
                <ul>
                    {details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default InfoCard;
