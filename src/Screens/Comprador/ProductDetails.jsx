import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, getProductsByCategory } from '../../api/products';
import ProductCard from '../../Components/ProductCard'; // Importa el componente ProductCard
import '../../Css/ProductDetail.css'; // Asegúrate de tener el archivo CSS
import NavBar from '../../Components/NavBar'; // Importa el componente NavBar

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productData = await getProduct(id);
                setProduct(productData);

                const productsInSameCategory = await getProductsByCategory(productData.category._id);
                const filteredProducts = productsInSameCategory.filter(product => product._id !== productData._id);
                setRelatedProducts(filteredProducts);
            } catch (err) {
                setError(err);
            }
        };

        fetchProduct();
    }, [id]);

    if (error) return <p>Error loading product: {error.message}</p>;
    if (!product) return <p>Loading...</p>;

    return (
        <>
            <NavBar /> {/* Añade el componente NavBar */}
            <div className="product-detail">
                <button className="back-button" onClick={() => navigate(-1)}>Back</button>

                <div className="product-content">
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
                        <p className="price">Price: <span>${product.price}</span></p>
                        <button className="add-to-cart">Add to Cart</button>
                    </div>
                </div>

                <div className="related-products">
                    <h2>Related Products</h2>
                    {relatedProducts.length > 0 ? (
                        <div className="related-products-list">
                            {relatedProducts.map((relatedProduct) => (
                                <ProductCard key={relatedProduct._id} product={relatedProduct} />
                            ))}
                        </div>
                    ) : (
                        <p>No related products found.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
