import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    company: { type: String, required: true },
    category: { type: String, required: true },
    colour: { type: String, required: true },
    price: { type: Number, required: true },
});

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
