// src/hooks/useFetchData.js
import { useState, useEffect } from 'react';
import { getProducts } from '../api/products';
import { getCategories } from '../api/category';

const useFetchData = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const productsData = await getProducts();
                if (!Array.isArray(productsData)) {
                    throw new Error("Datos de productos no válidos");
                }
                setProducts(productsData);

                const categoriesData = await getCategories();
                if (!Array.isArray(categoriesData)) {
                    throw new Error("Datos de categorías no válidos");
                }
                setCategories(['All', ...categoriesData.map(cat => cat.name)]);

                setLoading(false);
            } catch (error) {
                setError("Error al cargar datos de productos o categorías");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { products, categories, loading, error };
};

export default useFetchData;

