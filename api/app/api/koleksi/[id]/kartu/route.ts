import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid'; 
const getAuthenticatedUserId = () => MOCK_USER_ID; 

/**
 * Endpoint GET /api/koleksi/[id]/kartu: Mengambil kartu yang jatuh tempo.
 */
export async function GET(
    req: Request,
    context: { params: { id: string } } 
) {
    const koleksiId = context.params.id;
    const userId = getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    if (!koleksiId) {
        return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
    }

    try {
        const now = new Date();
        
        // Query Prisma: Ambil Kartu yang jatuh tempo DAN milik pengguna
        const kartuList = await prisma.kartu.findMany({
            where: {
                koleksiId: koleksiId,
                reviewDueAt: {
                    lte: now, // Jatuh tempo hari ini atau sebelumnya
                },
                koleksi: {
                    userId: userId, // Kriteria Keamanan
                },
            },
            select: {
                id: true,
                front: true,
                back: true,
                difficulty: true,
                reviewDueAt: true,
            },
            orderBy: {
                reviewDueAt: 'asc', 
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