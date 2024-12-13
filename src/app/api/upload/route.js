import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const runtime = "nodejs"; // Ensure it runs in the Node.js runtime

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        // Convert the file to a buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Define the local directory to store images
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure the "uploads" folder exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Construct the file path
        const filePath = path.join(uploadDir, file.name);

        // Write the file to the specified path
        await writeFile(filePath, buffer);

        // Return the relative URL of the uploaded image
        return NextResponse.json({ success: true, path: `/uploads/${file.name}` });
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json({ error: "Failed to upload file." }, { status: 500 });
    }
}
