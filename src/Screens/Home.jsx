import React, { useState, useEffect } from 'react';
import ProductCard from '../Components/ProductCard';
import '../Css/Home.css';
import NavBar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getCategories } from '../api/category';
import { getProductsByCategory } from '../api/products'; // Importar función para obtener productos por categoría
import useFetchData from '../Hooks/useFetchData';
import Portada from '../assets/portada.avif'

const Home = () => {
    const { products: allProducts, loading, error } = useFetchData();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]); // Estado para productos filtrados
    const [isLoadingProducts, setIsLoadingProducts] = useState(false); // Indicador de carga para productos por categoría
    const navigate = useNavigate();

    // Obtener categorías al montar el componente
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

    // Manejar el cambio de categoría
    const handleCategoryClick = async (categoryName) => {
        setSelectedCategory(categoryName === 'Todas las categorias' ? '' : categoryName);
        setIsLoadingProducts(true);

        try {
            if (categoryName === 'Todas las categorias') {
                setFilteredProducts(allProducts); // Mostrar todos los productos
            } else {
                const category = categories.find((cat) => cat.name === categoryName); // Buscar categoría por nombre
                if (category) {
                    const products = await getProductsByCategory(category._id); // Obtener productos por categoría
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

    // Cargar todos los productos inicialmente
    useEffect(() => {
        if (!selectedCategory) {
            setFilteredProducts(allProducts);
        }
    }, [allProducts, selectedCategory]);

    if (loading) return <p className="loading">Cargando...</p>;
    if (error) return <p className="error">Error al cargar los datos: {error.message}</p>;

    const handleViewMore = () => {
        navigate('/productos');
    };

    return (
        <>
            <NavBar />
            <div className="min-h-screen mx-3 my-3">
                {/* Sección de bienvenida */}
                <section className="mb-12">
                    <div className="bg-green-600 text-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between ">
                        <div className="mb-4 md:mb-0 md:mr-8">
                            <h2 className="text-3xl font-bold mb-2">Bienvenido a TecMarket</h2>
                            <p className="text-lg mb-4">Descubre los sabores más exquisitos en nuestra diversidad de productos</p>
                            <Button className="bg-white text-green-600 hover:bg-green-100" onClick={handleViewMore} >Explorar Productos</Button>
                        </div>
                        <img src={Portada} alt="Platillo de Portada" className="rounded-lg shadow-lg" />
                    </div>
                </section>

                {/* Sección de categorías */}
                <section className="categories mb-12">
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Categorías</h3>
                    <div className="categories-wrapper overflow-x-auto">
                        <div className="categories-content flex gap-4">
                            <Button
                                key="todas"
                                variant="outline"
                                className={`category-item text-green-600 border-green-300 hover:bg-green-50 ${selectedCategory === '' ? 'bg-green-100' : ''
                                    }`}
                                onClick={() => handleCategoryClick('Todas las categorias')}
                            >
                                Todas las categorias
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category._id}
                                    variant="outline"
                                    className={`category-item text-green-600 border-green-300 hover:bg-green-50 ${selectedCategory === category.name ? 'bg-green-100' : ''
                                        }`}
                                    onClick={() => handleCategoryClick(category.name)}
                                >
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>



                {/* Sección de productos */}
                <section className="recent-products">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        {selectedCategory ? `Productos recientes de ${selectedCategory}` : 'Productos más recientes'}
                    </h2>
                    {isLoadingProducts ? (
                        <p className="text-center text-lg text-gray-500">Cargando productos...</p>
                    ) : filteredProducts.length > 0 ? (
                        <div className="products-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-500">
                            {selectedCategory
                                ? `Todavía no hay productos disponibles en la categoría "${selectedCategory}". ¡Se están cocinando futuros productos!`
                                : 'No hay productos disponibles.'}
                        </p>
                    )}
                    {filteredProducts.length > 0 && (
                        <div className="grid place-items-center mt-4"> {/* Grid para centrar */}
                            <Button className="bg-green-700" onClick={handleViewMore}>
                                Conocer más productos
                            </Button>
                        </div>
                    )}
                </section>

            </div>
        </>
    );
};

export default Home;
