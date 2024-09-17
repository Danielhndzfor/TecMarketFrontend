import React, { useState, useEffect } from 'react';
import { createProduct } from '../../api/products'; // Ajusta la ruta según tu estructura
import { getCategories } from '../../api/category';

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
            // Manejar éxito (por ejemplo, redirigir al usuario o mostrar un mensaje)
        } catch (error) {
            console.error('Error creando el producto:', error);
            // Manejar error (mostrar un mensaje de error al usuario)
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre" required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción" required />
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Precio" required />
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" required />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Selecciona una categoría</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>
            <input type="file" multiple onChange={handleImageChange} />
            <button type="submit">Crear Producto</button>
        </form>
    );
};

export default CreateProduct;

