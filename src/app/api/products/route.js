import { NextResponse } from "next/server";
import { connectToDatabase } from "@/MongoLib/db";
import { Product } from "@/MongoLib/model/product";

// Connect to MongoDB
connectToDatabase();

// Handle API requests
export async function GET() {
    try {
        const products = await Product.find();
        return NextResponse.json({ success: true, data: products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, company, category, colour, price } = body;

        const newProduct = new Product({ name, company, category, colour, price });
        await newProduct.save();

        return NextResponse.json({ success: true, message: "Product created successfully", data: newProduct });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}