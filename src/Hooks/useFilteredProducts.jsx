// src/hooks/useFilteredProducts.js
import { useState, useEffect } from 'react';

const useFilteredProducts = (products, filter, sortOrder, categoryFilter) => {
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = products
                .filter(product =>
                    product.name.toLowerCase().includes(filter.toLowerCase()) &&
                    (categoryFilter === 'All' || product.category === categoryFilter)
                );

            if (sortOrder === 'asc') {
                filtered = filtered.sort((a, b) => a.price - b.price);
            } else {
                filtered = filtered.sort((a, b) => b.price - a.price);
            }

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, filter, sortOrder, categoryFilter]);

    return filteredProducts;
};

export default useFilteredProducts;
