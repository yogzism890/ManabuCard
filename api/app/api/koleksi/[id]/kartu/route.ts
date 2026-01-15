import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint GET /api/koleksi/[id]/kartu: Mengambil semua kartu dalam koleksi.
 * Mendukung filter berdasarkan type (TEXT/IMAGE).
 */
export async function GET(req: Request) {
    // Extract koleksiId dari URL path
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    // Expected: ['', 'api', 'koleksi', ':id', 'kartu']
    const koleksiId = pathParts[3]; // Index 3 karena path dimulai dengan '/'

    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;

    // Parse query params untuk filter type
    const cardType = url.searchParams.get('type'); // Optional: TEXT atau IMAGE

    if (!koleksiId) {
        return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
    }

    try {
        // Cek Keamanan: Pastikan Koleksi milik User yang login
        const koleksi = await prisma.koleksi.findFirst({
            where: { id: koleksiId, userId: userId },
        });

        if (!koleksi) {
            return NextResponse.json({ error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." }, { status: 403 });
        }

        // Build where clause dengan filter type opsional
        const whereClause: any = {
            koleksiId: koleksiId,
            isDeleted: false,
        };

        if (cardType && (cardType === "TEXT" || cardType === "IMAGE")) {
            whereClause.type = cardType;
        }

        // Query Prisma: Ambil SEMUA Kartu dalam koleksi yang milik pengguna
        const kartuList = await prisma.kartu.findMany({
            where: whereClause,
            select: {
                id: true,
                type: true,
                frontText: true,
                backText: true,
                frontImageUrl: true,
                backImageUrl: true,
                // Legacy fields
                front: true,
                back: true,
                difficulty: true,
                reviewDueAt: true,
                koleksiId: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'asc', // Urutkan berdasarkan waktu pembuatan
            }
        });

        return NextResponse.json(kartuList, { status: 200 });

    } catch (e) {
        console.error("Error fetching cards for study session:", e);
        return NextResponse.json(
            { error: "SERVER_ERROR: Failed to fetch cards." },
            { status: 500 }
        );
    }
}

export async function POST() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
