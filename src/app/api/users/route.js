import fs from "fs";
import path from "path";
import { user } from "@/util/db";
import { NextResponse } from "next/server";

// Path to db.js
const dbPath = path.join(process.cwd(), "src", "util", "db.js");

// Helper function to write data to db.js
function updateDbFile(newUserArray) {
    const content = `export const user = ${JSON.stringify(newUserArray, null, 4)};`;
    fs.writeFileSync(dbPath, content, "utf8");
}


export function GET(request,content){
    console.log(request);
    const data = user;
    return NextResponse.json(data,{status:200});
}


export async function POST(request) {
    try {
        const payload = await request.json();

        if (!payload.name || !payload.age || !payload.email) {
            return NextResponse.json(
                { result: "Required field not found", success: false },
                { status: 400 }
            );
        }

        if (isNaN(payload.age) || payload.age <= 0) {
            return NextResponse.json(
                { result: "Age must be a positive number", success: false },
                { status: 400 }
            );
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(payload.email)) {
            return NextResponse.json(
                { result: "Invalid email format", success: false },
                { status: 400 }
            );
        }

        // Create a new user and add to the array
        const newUser = {
            id: user.length + 1,
            name: payload.name,
            age: payload.age,
            email: payload.email,
        };

        user.push(newUser);

        // Write the updated array to the db.js file
        updateDbFile(user);

        return NextResponse.json(
            { result: "New User Created", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
            { result: "Internal server error", success: false },
            { status: 500 }
        );
    }
}


export async function PATCH(request) {
    try {
        const payload = await request.json();

        if (!payload.id) {
            return NextResponse.json(
                { result: "User ID is required", success: false },
                { status: 400 }
            );
        }

        const userIndex = user.findIndex((u) => u.id === payload.id);
        if (userIndex === -1) {
            return NextResponse.json(
                { result: "User not found", success: false },
                { status: 404 }
            );
        }

        if (payload.name) user[userIndex].name = payload.name;
        if (payload.age) {
            if (isNaN(payload.age) || payload.age <= 0) {
                return NextResponse.json(
                    { result: "Age must be a positive number", success: false },
                    { status: 400 }
                );
            }
            user[userIndex].age = payload.age;
        }
        if (payload.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(payload.email)) {
                return NextResponse.json(
                    { result: "Invalid email format", success: false },
                    { status: 400 }
                );
            }
            user[userIndex].email = payload.email;
        }

        return NextResponse.json(
            { result: "User updated successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
            { result: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
export async function PUT(request) {
    try {
        const payload = await request.json();

        if (!payload.id) {
            return NextResponse.json(
                { result: "User ID is required", success: false },
                { status: 400 }
            );
        }

        const userIndex = user.findIndex((u) => u.id === payload.id);
        if (userIndex === -1) {
            return NextResponse.json(
                { result: "User not found", success: false },
                { status: 404 }
            );
        }

        // Validate payload
        if (!payload.name || !payload.age || !payload.email) {
            return NextResponse.json(
                { result: "Required fields (name, age, email) are missing", success: false },
                { status: 400 }
            );
        }

        if (isNaN(payload.age) || payload.age <= 0) {
            return NextResponse.json(
                { result: "Age must be a positive number", success: false },
                { status: 400 }
            );
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(payload.email)) {
            return NextResponse.json(
                { result: "Invalid email format", success: false },
                { status: 400 }
            );
        }

        // Update user
        user[userIndex] = { ...user[userIndex], ...payload };

        // Persist changes to db.js
        updateDbFile(user);

        return NextResponse.json(
            { result: "User updated successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
            { result: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
export async function DELETE(request) {
    try {
        const payload = await request.json();

        if (!payload.id) {
            return NextResponse.json(
                { result: "User ID is required", success: false },
                { status: 400 }
            );
        }

        const userIndex = user.findIndex((u) => u.id === payload.id);
        if (userIndex === -1) {
            return NextResponse.json(
                { result: "User not found", success: false },
                { status: 404 }
            );
        }

        // Remove user from the array
        user.splice(userIndex, 1);

        // Persist changes to db.js
        updateDbFile(user);

        return NextResponse.json(
            { result: "User deleted successfully", success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json(
            { result: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
