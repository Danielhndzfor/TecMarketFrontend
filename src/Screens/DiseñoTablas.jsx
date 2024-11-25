import React from 'react';
import { Pencil, Trash2, Search, Filter, ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const ProductTable = ({ products }) => {
    const allKeys = Array.from(new Set(products.flatMap(product => Object.keys(product))));

    return (
        <div className="p-4 space-y-6 bg-background">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-primary">Catálogo de Productos</h2>
                <Button className="bg-green-700 hover:bg-green-800 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label htmlFor="search" className="block text-sm font-medium text-muted-foreground mb-1">Buscar</label>
                    <div className="relative">
                        <Input
                            id="search"
                            type="text"
                            placeholder="Buscar productos..."
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Categoría</label>
                    <Select id="category">
                        <option value="">Todas las categorías</option>
                        <option value="electronica">Electrónica</option>
                        <option value="computadoras">Computadoras</option>
                        <option value="wearables">Wearables</option>
                    </Select>
                </div>
                <div className="w-full md:w-1/4">
                    <label htmlFor="stock" className="block text-sm font-medium text-muted-foreground mb-1">Stock</label>
                    <Select id="stock">
                        <option value="">Todos</option>
                        <option value="inStock">En stock</option>
                        <option value="outOfStock">Agotado</option>
                    </Select>
                </div>
                <Button className="w-full md:w-auto bg-green-700 hover:bg-green-800 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    Aplicar Filtros
                </Button>
            </div>

            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-green-700 text-white">
                                {allKeys.map(key => (
                                    <th key={key} className="p-3 text-left font-semibold first:rounded-tl-lg">
                                        <div className="flex items-center justify-between">
                                            <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                                            <button className="text-white hover:bg-green-600 rounded p-1">
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                                <th className="p-3 text-left font-semibold rounded-tr-lg">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : 'bg-background hover:bg-muted/30 transition-colors'}>
                                    {allKeys.map(key => (
                                        <td key={key} className="p-3 border-t border-border">
                                            {key === 'inStock' ? (
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product[key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {product[key] ? 'En stock' : 'Agotado'}
                                                </span>
                                            ) : key === 'price' ? (
                                                `$${product[key].toFixed(2)}`
                                            ) : typeof product[key] === 'object' ? (
                                                <span className="text-sm text-muted-foreground">
                                                    {JSON.stringify(product[key])}
                                                </span>
                                            ) : (
                                                product[key]?.toString() || '-'
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-3 border-t border-border">
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" className="text-green-700 hover:text-white hover:bg-green-700">
                                                <Pencil className="h-4 w-4 mr-1" />
                                                Editar
                                            </Button>
                                            <Button variant="outline" size="sm" className="text-red-600 hover:text-white hover:bg-red-600">
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Eliminar
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                <div className="text-sm text-muted-foreground">
                    Mostrando <span className="font-medium">1</span> a <span className="font-medium">3</span> de <span className="font-medium">10</span> resultados
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-green-700 hover:text-white hover:bg-green-700">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" className="text-green-700 hover:bg-green-700 hover:text-white">1</Button>
                    <Button variant="outline" size="sm" className="text-green-700 hover:bg-green-700 hover:text-white">2</Button>
                    <Button variant="outline" size="sm" className="text-green-700 hover:bg-green-700 hover:text-white">3</Button>
                    <span className="text-muted-foreground">...</span>
                    <Button variant="outline" size="sm" className="text-green-700 hover:bg-green-700 hover:text-white">10</Button>
                    <Button variant="outline" size="sm" className="text-green-700 hover:text-white hover:bg-green-700">
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Ejemplo de uso
export default function Component() {
    const sampleProducts = [
        {
            id: 1,
            name: "Smartphone XYZ",
            brand: "TechCo",
            price: 599.99,
            inStock: true,
            category: "Electrónica",
            specs: { screen: "6.5 pulgadas OLED", ram: "8GB" }
        },
        {
            id: 2,
            name: "Laptop ABC",
            brand: "ComputerCo",
            price: 1299.99,
            inStock: false,
            category: "Computadoras",
            specs: { processor: "Intel i7", ram: "16GB" }
        },
        {
            id: 3,
            name: "Smartwatch 123",
            brand: "WearableCo",
            price: 199.99,
            inStock: true,
            category: "Wearables",
            specs: { screen: "1.5 pulgadas AMOLED", battery: "5 días" }
        }
    ];

    return <ProductTable products={sampleProducts} />;
}