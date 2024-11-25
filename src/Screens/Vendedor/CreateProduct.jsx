import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import { createProduct } from '../../api/products'; // Ajusta la ruta según tu estructura
import { getCategories } from '../../api/category';
import NavBar from '../../Components/NavBar';

// Función para obtener el ID del vendedor del token
const getSellerIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.id; // Asegúrate de que el token contenga el ID del vendedor
    }
    return null;
};

const CreateProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [seller, setSeller] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mensaje de éxito
    const Navigate = useNavigate();

    useEffect(() => {
        // Cargar las categorías al montar el componente
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };
        fetchCategories();

        // Obtener el ID del vendedor
        const sellerId = getSellerIdFromToken();
        setSeller(sellerId);
    }, []);

    const handleImageChange = (e) => {
        setImages(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('seller', seller); // Incluye el ID del vendedor

        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        try {
            // Llamada a la API para crear el producto
            await createProduct(formData);
            // Manejar éxito
            setSuccessMessage('Producto creado exitosamente!'); // Mensaje de éxito

            // Redirigir a la página de productos después de 2 segundos
            setTimeout(() => {
                Navigate('/home');
            }, 2000);

            // Limpia el formulario
            setName('');
            setDescription('');
            setPrice('');
            setStock('');
            setCategory('');
            setImages([]);
        } catch (error) {
            console.error('Error creando el producto:', error);
            // Manejar error (mostrar un mensaje de error al usuario)
        }
    };

    return (
        <>
            <NavBar />
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-emerald-600 mb-4">Crear Producto</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nombre"
                        required
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción"
                        required
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Precio"
                        required
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Stock"
                        required
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="w-full p-2 border border-emerald-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <div className="flex flex-wrap mt-4">
                        {Array.from(images).map((image, index) => (
                            <div key={index} className="w-1/5 p-1">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Imagen ${index + 1}`}
                                    className="w-full h-20 object-cover border border-emerald-300 rounded"
                                />
                            </div>
                        ))}
                        {images.length < 5 && (
                            <div className="w-1/5 p-1 border border-dashed border-emerald-300 rounded h-20 flex items-center justify-center">
                                <span className="text-gray-400">Espacio para imagen</span>
                            </div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition duration-200"
                    >
                        Crear Producto
                    </button>
                    <button
                        onClick={() => Navigate(window.history.back())}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded transition duration-200"
                    >
                        Cancelar
                    </button>
                </form>
                {successMessage && <p className="mt-4 text-green-600 text-center">{successMessage}</p>} {/* Mostrar mensaje de éxito */}
            </div>
        </>
    );
};

export default CreateProduct;


