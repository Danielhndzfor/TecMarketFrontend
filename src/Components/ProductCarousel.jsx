import React from 'react';
import Carousel from 'react-bootstrap/Carousel';  // Si usas Bootstrap o cualquier otro componente de carrusel

function ProductCarousel({ products }) {
    const topRatedProducts = products.filter(product => product.rating >= 4);  // Solo los mejor calificados

    return (
        <Carousel>
            {topRatedProducts.slice(0, 5).map((product) => (
                <Carousel.Item key={product.id}>
                    <img
                        className="d-block w-100"
                        src={product.image}
                        alt={product.name}
                    />
                    <Carousel.Caption>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default ProductCarousel;
