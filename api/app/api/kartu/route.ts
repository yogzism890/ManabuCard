import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Endpoint POST /api/kartu: Menambahkan kartu baru ke koleksi tertentu.
 */
export async function POST(req: Request) {
    const authHeader = headers().get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;

    try {
        const body = await req.json();
        const { koleksiId, front, back } = body;

        if (!koleksiId || !front || !back) {
            return NextResponse.json(
                { error: "Koleksi ID, front, dan back wajib diisi." },
                { status: 400 }
            );
        }

        // Cek Keamanan: Pastikan Koleksi milik User yang login (di-comment untuk development)
        // const koleksi = await prisma.koleksi.findUnique({
        //     where: { id: koleksiId, userId: userId },
        // });

        // if (!koleksi) {
        //     return NextResponse.json(
        //         { error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." },
        //         { status: 403 }
        //     );
        // }

        // Buat Kartu Baru: Inisialisasi SRS (reviewDueAt = sekarang, difficulty = 0)
        const newKartu = await prisma.kartu.create({
            data: {
                koleksiId,
                front,
                back,
                difficulty: 0,
                reviewDueAt: new Date(),
            },
        });

        return NextResponse.json(newKartu, { status: 201 });

    } catch (e) {
        console.error("Error creating new card:", e);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal membuat kartu." }, { status: 500 });
    }
}

/**
 * Endpoint GET /api/kartu: Mengambil semua kartu pengguna (opsional, dengan filter koleksi).
 */
export async function GET(req: Request) {
    const authHeader = headers().get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;

    try {
        const url = new URL(req.url);
        const koleksiId = url.searchParams.get('koleksiId');

        const whereClause = {
            koleksi: { userId: userId },
            isDeleted: false,
        } as any;

        if (koleksiId) {
            whereClause.koleksiId = koleksiId;
        }

        const kartuList = await prisma.kartu.findMany({
            where: whereClause,
            select: {
                id: true,
                front: true,
                back: true,
                difficulty: true,
                reviewDueAt: true,
                koleksiId: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(kartuList, { status: 200 });
    } catch (error) {
        console.error("Error fetching cards:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal mengambil kartu." }, { status: 500 });
    }
}