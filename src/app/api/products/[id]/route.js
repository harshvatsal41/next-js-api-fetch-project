import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/MongoLib/db";
import { Product } from "@/MongoLib/model/product";

// GET Product by ID
export async function GET(request, { params }) {
    const { id } = params;
    console.log(`${id} ptttt`);
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
    }
}

// UPDATE Product by ID
export async function PUT(request, { params }) {
    const { id } = params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    try {
        const body = await request.json();
        const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
        if (!updatedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 });
    }
}

// DELETE Product by ID
export async function DELETE(request, { params }) {
    const { id } = params;
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
    }
}
