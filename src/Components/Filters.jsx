import React, { useState } from 'react';

function Filters({ onFilter }) {
    const [filterCriteria, setFilterCriteria] = useState('');

    const handleChange = (e) => {
        setFilterCriteria(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter(filterCriteria);  // Llamar la función de filtrado en Home
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="category">Categoría:</label>
            <input
                type="text"
                id="category"
                name="category"
                value={filterCriteria}
                onChange={handleChange}
            />
            <button type="submit">Filtrar</button>
        </form>
    );
}

export default Filters;
