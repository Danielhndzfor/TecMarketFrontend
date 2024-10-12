import React from 'react';
import ProductCard from '../Components/ProductCard';
import useFetchData from '../Hooks/useFetchData';
import useFilters from '../Hooks/useFilters';
import usePagination from '../Hooks/usePagination';
import '../Css/Home.css';
import NavBar from '../Components/NavBar';

const Home = () => {
    const { products, loading, error } = useFetchData();

    const {
        filter,
        setFilter,
        sortOrder,
        setSortOrder,
        applyFilters,
    } = useFilters(products, '', 'asc');

    const filteredProducts = applyFilters();

    const { currentItems, totalPages, paginate, currentPage } = usePagination(filteredProducts, 10);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data: {error.message}</p>;

    return (
        <>
            <NavBar />
            <div>
                <h1>Lista de Productos</h1>

                {/* Filtro por nombre */}
                <input
                    type="text"
                    value={filter}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        paginate(1); // Reiniciar la página al filtrar
                    }}
                    placeholder="Filtrar productos por nombre"
                    className="filter-input"
                />

                {/* Ordenar por precio */}
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="filter-select">
                    <option value="asc">Precio: Menor a Mayor</option>
                    <option value="desc">Precio: Mayor a Menor</option>
                </select>

                {/* Lista de productos con paginación */}
                <div className="products-list">
                    {currentItems.length > 0 ? (
                        currentItems.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <p>No hay productos disponibles</p>
                    )}
                </div>

                {/* Paginación */}
                <div className="pagination">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={currentPage === i + 1 ? 'active' : ''}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
