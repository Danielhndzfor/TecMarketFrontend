import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct } from '../../api/products'; // Importa la función correcta
import ReviewCard from '../../Components/ReviewCard'; // Componente para mostrar reseñas
import '../../Css/ProductDetail.css'; // Asegúrate de tener el archivo CSS

const ProductDetail = () => {
    const { id } = useParams(); // Obtener el ID del producto desde la URL
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook para navegación

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProduct(id);
                setProduct(productData);
            } catch (err) {
                setError(err);
            }
        };

        fetchProduct();
    }, [id]);

    if (error) return <p>Error loading product: {error.message}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <div className="product-detail">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            
            <div className="product-images">
                <div className="main-image">
                    <img src={product.images[0]} alt={product.name} />
                </div>
                <div className="thumbnail-images">
                    {product.images.map((image, index) => (
                        <img 
                            key={index}
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            onClick={() => document.querySelector('.main-image img').src = image}
                        />
                    ))}
                </div>
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p>{product.description}</p>
                <p className="price">Price: ${product.price}</p>
                <button className="add-to-cart">Add to Cart</button>
            </div>
            <div className="reviews-section">
                <h2>Reviews</h2>
                <div className="reviews">
                    {product.reviews && product.reviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

