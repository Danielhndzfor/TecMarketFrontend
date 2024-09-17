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
                setProducts(productsData);

                const categoriesData = await getCategories();
                // Asegúrate de que categoriesData sea un array de strings
                setCategories(['All', ...categoriesData.map(cat => cat.name)]);

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { products, categories, loading, error };
};

export default useFetchData;
