import mongoose from "mongoose";

let isConnected = false; // Maintain the connection state

export const connectionStr = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.w5zcq.mongodb.net/productDB?retryWrites=true&w=majority&appName=Cluster0`;

export async function connectToDatabase() {
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
        throw new Error("Database credentials are missing in environment variables");
    }

    try {
        const db = await mongoose.connect(connectionStr); // No need for `useNewUrlParser` or `useUnifiedTopology`
        isConnected = db.connection.readyState === 1; // 1 means connected
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
}
