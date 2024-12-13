"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();

    const isActive = (path) =>
        pathname === path
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-700 hover:text-blue-500";

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="text-xl font-semibold">
                        <Link href="/" className="text-gray-800">
                            MyApp
                        </Link>
                    </div>

                    {/* Links */}
                    <div className="flex space-x-4">
                        <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/")}`}>
                            Home
                        </Link>
                        <Link
                            href="/users"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/users")}`}
                        >
                            Users
                        </Link>
                        <Link
                            href="/products"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${isActive("/products")}`}
                        >
                            Products
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
