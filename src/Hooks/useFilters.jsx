import React, { useMemo } from 'react';

const useFilters = (products, initialFilter, initialSortOrder) => {
    const [filter, setFilter] = React.useState(initialFilter);
    const [sortOrder, setSortOrder] = React.useState(initialSortOrder);

    // Función para aplicar filtros y ordenación
    const applyFilters = useMemo(() => {
        return () => {
            let filtered = products.filter(product => 
                product.name.toLowerCase().includes(filter.toLowerCase())
            );

            if (sortOrder === 'asc') {
                filtered = filtered.sort((a, b) => a.price - b.price);
            } else {
                filtered = filtered.sort((a, b) => b.price - a.price);
            }

            return filtered;
        };
    }, [products, filter, sortOrder]);

    return {
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        applyFilters,
    };
};

export default useFilters;

