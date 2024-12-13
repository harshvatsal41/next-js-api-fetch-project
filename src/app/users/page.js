"use client";

import { useState, useEffect } from "react";

async function fetchUsers() {
    const res = await fetch("http://localhost:3000/api/users");
    if (!res.ok) {
        throw new Error("Failed to fetch users");
    }
    return res.json();
}

async function addUser(userData) {
    const res = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        throw new Error("Failed to add user");
    }
    return res.json();
}

async function updateUser(userId, userData) {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!res.ok) {
        throw new Error("Failed to update user");
    }
    return res.json();
}

async function deleteUser(userId) {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }),
    });

    if (!res.ok) {
        throw new Error("Failed to delete user");
    }
    return res.json();
}

export default function Page() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        email: "",
    });
    const [editUserId, setEditUserId] = useState(null);

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch((err) => setError(err.message));
    }, [isFormVisible, editUserId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editUserId) {
                await updateUser(editUserId, formData);
                setEditUserId(null); // Reset edit state
            } else {
                await addUser(formData);
            }
            setIsFormVisible(false);
            setFormData({ name: "", age: "", email: "" });
        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (user) => {
        setEditUserId(user.id);
        setFormData({ name: user.name, age: user.age, email: user.email });
        setIsFormVisible(true);
    };

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleCancel = () => {
        setIsFormVisible(false);
        setEditUserId(null);
        setFormData({ name: "", age: "", email: "" });
    };

    if (error) {
        return <div className="text-red-500 text-center mt-4">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-center mb-8">User List</h1>

            <button
                onClick={() => {
                    setIsFormVisible(true);
                    setEditUserId(null); // Reset edit state
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
            >
                Add User
            </button>

            {isFormVisible && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 p-4 border rounded-lg shadow-md bg-white"
                >
                    <h2 className="text-lg font-semibold mb-4">
                        {editUserId ? "Edit User" : "Add New User"}
                    </h2>
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
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                            {editUserId ? "Update User" : "Add User"}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white border rounded-lg shadow-md p-4 transition-transform transform hover:scale-105"
                    >
                        <p className="text-sm text-gray-600">
                            <strong>ID:</strong> {user.id}
                        </p>
                        <h2 className="text-lg font-semibold text-blue-400 mb-2">{user.name}</h2>
                        <p className="text-sm text-gray-600">
                            <strong>Email:</strong> {user.email}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Age:</strong> {user.age}
                        </p>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => handleEdit(user)}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
