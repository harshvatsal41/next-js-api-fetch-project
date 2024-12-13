"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetails() {
    const router = useRouter();
    const pathname = usePathname();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extracting the product ID from the pathname
    const id = pathname.split("/").pop();

    useEffect(() => {
        // If no ID is present, show an error and stop further processing
        if (!id) {
            setError("Product ID not found.");
            setLoading(false);
            return;
        }

        // Function to fetch product details
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.data); // Set product data on success
                } else {
                    setError("Failed to fetch product."); // Handle error case
                }
            } catch (err) {
                setError("An error occurred while fetching the product."); // Handle fetch error
            } finally {
                setLoading(false); // Stop loading once the request is done
            }
        };

        fetchProduct();
    }, [id]); // Dependency ensures effect is re-run if `id` changes

    // Render loading state
    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    // Render error state
    if (error) {
        return <div className="text-center mt-10 text-red-500">{error}</div>;
    }

    // Render product details
    return (
        <div className="max-w-2xl mx-auto mt-10 p-5">
            <h1 className="text-2xl font-bold mb-5">{product.name}</h1>
            <p className="mb-2">
                <strong>Company:</strong> {product.company}
            </p>
            <p className="mb-2">
                <strong>Category:</strong> {product.category}
            </p>
            <p className="mb-2">
                <strong>Colour:</strong> {product.colour}
            </p>
            <p className="mb-2">
                <strong>Price:</strong> ${product.price}
            </p>
            <button
                onClick={() => router.push("/products")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mt-5"
            >
                Back to Products
            </button>
        </div>
    );
}
