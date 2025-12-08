import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';
const getAuthenticatedUserId = () => MOCK_USER_ID;

/**
 * Endpoint GET /api/koleksi/[id]/kartu: Mengambil semua kartu dalam koleksi.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: koleksiId } = await params;
    const userId = getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    if (!koleksiId) {
        return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
    }

    try {
        // Query Prisma: Ambil SEMUA Kartu dalam koleksi yang milik pengguna
        // Cek Keamanan: Pastikan Koleksi milik User yang login (di-comment untuk development)
        const kartuList = await prisma.kartu.findMany({
            where: {
                koleksiId: koleksiId,
                // koleksi: {
                //     userId: userId, // Kriteria Keamanan
                // },
                isDeleted: false, // Hanya kartu yang belum dihapus
            },
            select: {
                id: true,
                front: true,
                back: true,
                difficulty: true,
                reviewDueAt: true,
                koleksiId: true,
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
