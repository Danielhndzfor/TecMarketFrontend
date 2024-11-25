import React, { useState, useEffect } from 'react';
import ProductCard from '../../Components/ProductCard';
import '../../Css/Home.css';
import NavBar from '../../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { getCategories } from '../../api/category';
import { getProductsByCategory } from '../../api/products';
import useFetchData from '../../Hooks/useFetchData';
import { Slider } from '@mui/material'; // Slider de Material UI
import { CircularProgress } from '@mui/material'; // Spinner de carga

const Productos = () => {
    const { products: allProducts, loading, error } = useFetchData();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 1000]); // Rango de precios
    const [maxPrice, setMaxPrice] = useState(1000); // Precio máximo
    const [sortOrder, setSortOrder] = useState('');
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        // Obtener el precio más alto al cargar los productos
        if (allProducts.length > 0) {
            const highestPrice = Math.max(...allProducts.map((product) => product.price));
            setMaxPrice(highestPrice);
            setPriceRange([0, highestPrice]); // Establecer el rango de precios con el valor máximo
        }
    }, [allProducts]);

    const handleCategoryClick = async (categoryName) => {
        setSelectedCategory(categoryName === 'Todas las categorias' ? '' : categoryName);
        setIsLoadingProducts(true);

        try {
            if (categoryName === 'Todas las categorias') {
                setFilteredProducts(allProducts);
            } else {
                const category = categories.find((cat) => cat.name === categoryName);
                if (category) {
                    const products = await getProductsByCategory(category._id);
                    setFilteredProducts(products);
                } else {
                    setFilteredProducts([]);
                }
            }
        } catch (error) {
            console.error('Error al filtrar productos:', error);
            setFilteredProducts([]);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    useEffect(() => {
        const filtered = allProducts.filter(
            (product) =>
                product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        setFilteredProducts(filtered);
    }, [priceRange, allProducts]);

    const handleSortChange = (event) => {
        const order = event.target.value;
        setSortOrder(order);

        let sortedProducts = [...filteredProducts];
        if (order === 'price-asc') {
            sortedProducts.sort((a, b) => a.price - b.price);
        } else if (order === 'price-desc') {
            sortedProducts.sort((a, b) => b.price - a.price);
        } else if (order === 'alphabetical') {
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredProducts(sortedProducts);
    };

    const resetFilters = () => {
        setSelectedCategory('');
        setPriceRange([0, maxPrice]);
        setSortOrder('');
        setFilteredProducts(allProducts);
    };

    if (loading) return <div className="loading-spinner"><CircularProgress /></div>;
    if (error) return <p className="error">Error al cargar los datos: {error.message}</p>;

    return (
        <>
            <NavBar />
            <div className="min-h-screen flex mx-3 my-3">

                {/* Panel lateral */}
                <aside className="w-1/4 p-4 bg-gray-100 rounded-md shadow-md">
                    <h3 className="text-lg font-bold mb-4 text-gray-800">Filtros</h3>

                    {/* Categorías */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-2">Categorías</h4>
                        <Button
                            key="todas"
                            variant="outline"
                            className={`w-full mb-2 ${
                                selectedCategory === '' ? 'bg-green-100' : ''
                            }`}
                            onClick={() => handleCategoryClick('Todas las categorias')}
                        >
                            Todas las categorías
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category._id}
                                variant="outline"
                                className={`w-full mb-2 ${
                                    selectedCategory === category.name ? 'bg-green-100' : ''
                                }`}
                                onClick={() => handleCategoryClick(category.name)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    {/* Rango de precios */}
                    <div className="mb-6">
                        <h4 className="text-md font-semibold mb-2">Rango de precios</h4>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            max={maxPrice} // Usar el precio más alto como límite superior
                            step={10}
                        />
                        <p className="text-sm text-gray-600">
                            ${priceRange[0]} - ${priceRange[1]}
                        </p>
                    </div>

                    {/* Botón de eliminar filtros */}
                    <Button
                        variant="outline"
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700"
                        onClick={resetFilters}
                    >
                        Eliminar filtros
                    </Button>
                </aside>

                {/* Contenido principal */}
                <main className="w-3/4 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {selectedCategory ? `Productos de ${selectedCategory}` : 'Todos los productos'}
                        </h2>

                        {/* Select de ordenamiento */}
                        <select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700"
                        >
                            <option value="">Ordenar por</option>
                            <option value="price-asc">Precio: Menor a mayor</option>
                            <option value="price-desc">Precio: Mayor a menor</option>
                            <option value="alphabetical">Alfabéticamente</option>
                        </select>
                    </div>

                    {isLoadingProducts ? (
                        <div className="loading-spinner flex justify-center items-center">
                            <CircularProgress />
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-500">
                            No hay productos disponibles para los filtros seleccionados.
                        </p>
                    )}
                </main>
            </div>
        </>
    );
};

export default Productos;

