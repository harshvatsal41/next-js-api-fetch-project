'use client'

import { useState, useEffect } from "react";
import {useRouter} from "next/navigation";

export default function ProductManager() {
    const [products, setProducts] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [formData, setFormData] = useState({ name: "", company: "", category: "", colour: "", price: "" });
    const [editingProductId, setEditingProductId] = useState(null);

    const router = useRouter();

    useEffect(() => {
        fetchProducts();
    }, [formVisible]);

    const fetchProducts = async () => {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
            setProducts(data.data);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const method = editingProductId ? "PUT" : "POST";
        const endpoint = editingProductId ? `/api/products/${editingProductId}` : "/api/products";

        const response = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (data.success) {
            fetchProducts();
            setFormVisible(false);
            setFormData({ name: "", company: "", category: "", colour: "", price: "" });
            setEditingProductId(null);
        }

    };

    const handleEdit = (product) => {
        setFormVisible(true);
        setFormData({
            name: product.name,
            company: product.company,
            category: product.category,
            colour: product.colour,
            price: product.price,
        });
        setEditingProductId(product._id);
    };

    const handleDelete = async (id) => {
        const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (data.success) {
            fetchProducts();
        }
    };

    const handleViewProduct = (id) => {
        router.push(`/products/${id}`);
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-5">
            <h1 className="text-2xl font-bold mb-5">Product Manager</h1>
            <button
                onClick={() => {
                    setFormVisible(!formVisible);
                    setEditingProductId(null); // Reset editing mode
                    setFormData({ name: "", company: "", category: "", colour: "", price: "" });
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-5"
            >
                {formVisible ? "Cancel" : "Add New Product"}
            </button>

            {formVisible && (
                <form onSubmit={handleFormSubmit} className="bg-gray-100 p-5 rounded-md mb-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Company"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Colour"
                            value={formData.colour}
                            onChange={(e) => setFormData({ ...formData, colour: e.target.value })}
                            required
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                            className="border p-2 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md mt-5"
                    >
                        {editingProductId ? "Update Product" : "Save Product"}
                    </button>
                </form>
            )}

            <ul className="grid gap-4">
                {products.map((product) => (
                    <li key={product._id} className="bg-white shadow-md p-4 rounded-md flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p className="text-sm text-gray-500">{product.company}</p>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-sm text-gray-500">${product.price}</p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleViewProduct(product._id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md"
                            >
                                View
                            </button>
                            <button
                                onClick={() => handleEdit(product)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded-md"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
