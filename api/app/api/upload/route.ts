import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint POST /api/upload: Upload gambar ke server.
 * Mengembalikan URL gambar yang diupload.
 */
export async function POST(req: NextRequest) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;

    if (!userId) {
        return NextResponse.json(
            { error: "Unauthorized: User not authenticated" },
            { status: 401 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No image file provided" },
                { status: 400 }
            );
        }

        // Validasi tipe file
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, GIF, WebP" },
                { status: 400 }
            );
        }

        // Validasi ukuran (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB" },
                { status: 400 }
            );
        }

        // Generate unique filename
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const ext = path.extname(file.name) || ".jpg";
        const filename = `card_${userId}_${timestamp}_${randomSuffix}${ext}`;

        // Simpan ke folder uploads
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        // Buat folder jika belum ada
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Folder mungkin sudah ada
        }

        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);

        // Return URL
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const imageUrl = `${baseUrl}/uploads/${filename}`;

        return NextResponse.json(
            { url: imageUrl, filename },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}

// Disable body parsing untuk GET
export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}

