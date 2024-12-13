import fs from "fs";
import path from "path";
import { user } from "@/util/db";
import { NextResponse } from "next/server";

const dbPath = path.join(process.cwd(), "src", "util", "db.js");

// Helper function to write data to db.js
function updateDbFile(newUserArray) {
    const content = `export const user = ${JSON.stringify(newUserArray, null, 4)};`;
    fs.writeFileSync(dbPath, content, "utf8");
}

// GET all users
export function GET(request, context) {
    if (context.params?.id) {
        // Extract the ID from the route parameters
        const { id } = context.params;

        // Find the user with the matching ID
        const data = user.find((u) => u.id === parseInt(id, 10));

        // If no user is found, return a 404 response
        if (!data) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Return the user data with a 200 status code
        return NextResponse.json(data, { status: 200 });
    }

    // Return all users if no ID is provided
    return NextResponse.json(user, { status: 200 });
}

// POST: Add a new user
export async function POST(request) {
    const payload = await request.json();

    if (!payload.name || !payload.age || !payload.email || !payload.state) {
        return NextResponse.json(
            { result: "Required field not found", success: false },
            { status: 400 }
        );
    }

    const newUser = {
        id: user.length ? user[user.length - 1].id + 1 : 1,
        ...payload,
        url: `/users/${user.length ? user[user.length - 1].id + 1 : 1}`,
    };

    user.push(newUser);
    updateDbFile(user);

    return NextResponse.json({ result: "User added successfully", success: true }, { status: 201 });
}

// PUT: Update an existing user
export async function PUT(request, { params }) {
    const id = parseInt(params.id);
    const index = user.findIndex((u) => u.id === id);

    if (index === -1) {
        return NextResponse.json(
            { result: "User not found", success: false },
            { status: 404 }
        );
    }

    const payload = await request.json();
    user[index] = { ...user[index], ...payload };
    updateDbFile(user);

    return NextResponse.json(
        { result: "User updated successfully", success: true },
        { status: 200 }
    );
}

// DELETE: Remove a user
export function DELETE(request, { params }) {
    const id = parseInt(params.id);
    const index = user.findIndex((u) => u.id === id);

    if (index === -1) {
        return NextResponse.json(
            { result: "User not found", success: false },
            { status: 404 }
        );
    }

    user.splice(index, 1);
    updateDbFile(user);

    return NextResponse.json(
        { result: "User deleted successfully", success: true },
        { status: 200 }
    );
}
