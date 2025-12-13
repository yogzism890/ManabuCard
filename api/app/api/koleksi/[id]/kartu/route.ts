import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint GET /api/koleksi/[id]/kartu: Mengambil semua kartu dalam koleksi.
 */
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;
    const { id: koleksiId } = await params;

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

        // Query Prisma: Ambil SEMUA Kartu dalam koleksi yang milik pengguna
        const kartuList = await prisma.kartu.findMany({
            where: {
                koleksiId: koleksiId,
                isDeleted: false, // Hanya kartu yang belum dihapus
            },
            select: {
                id: true,
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
