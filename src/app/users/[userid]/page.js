"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

async function fetchUser(id) {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        cache: "no-store", // Ensures fresh data is fetched every time
    });
    if (!res.ok) {
        throw new Error("No user details found");
    }
    return res.json();
}

async function updateUser(id, updatedData) {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
    });

    if (!res.ok) {
        throw new Error("Failed to update user");
    }

    return res.json();
}

async function deleteUser(id) {
    const res = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("Failed to delete user");
    }

    return res.json();
}

export default function Page({ params }) {
    const { userid } = params;
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        age: "",
    });
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await fetchUser(userid);
                setUser(data);
                setFormData({
                    name: data.name,
                    email: data.email,
                    age: data.age,
                });
            } catch (err) {
                setError(err.message);
            }
        }

        fetchData();
    }, [userid]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(userid, formData);
            setUser(formData); // Update UI with the new data
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        const confirmDelete = confirm(
            "Are you sure you want to delete this user? This action cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            await deleteUser(userid);
            router.push("/users"); // Redirect to the user list page
        } catch (err) {
            alert(err.message);
        }
    };

    if (error) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-red-500">Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    if (!user) {
        return <div className="p-8 text-center">Loading user details...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">User Details</h1>

            {isEditing ? (
                <form
                    onSubmit={handleEditSubmit}
                    className="bg-white p-6 rounded-lg shadow-md"
                >
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-sm font-medium mb-1">
                            Age
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className="border rounded-md p-2 w-full"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-600">
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Age:</strong> {user.age}
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
