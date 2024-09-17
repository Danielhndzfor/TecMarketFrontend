// src/hooks/usePagination.js
import { useState } from 'react';

const usePagination = (items, itemsPerPage) => {
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(items.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return {
        currentItems,
        totalPages,
        paginate,
        currentPage,
    };
};

export default usePagination;
