import mongoose from "mongoose";

const connection = {}; // Maintain the connection state

export const connectionStr = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.w5zcq.mongodb.net/productDB?retryWrites=true&w=majority&appName=Cluster0`;

export async function connectToDatabase() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(connectionStr, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}
