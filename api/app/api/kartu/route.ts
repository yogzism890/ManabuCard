import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid'; 
const getAuthenticatedUserId = () => MOCK_USER_ID; 

/**
 * Endpoint POST /api/kartu: Menambahkan kartu baru ke koleksi tertentu.
 */
export async function POST(req: Request) {
    const userId = getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { koleksiId, front, back } = body;

        if (!koleksiId || !front || !back) {
            return NextResponse.json(
                { error: "Koleksi ID, front, dan back wajib diisi." },
                { status: 400 }
            );
        }

        // Cek Keamanan: Pastikan Koleksi milik User yang login
        const koleksi = await prisma.koleksi.findUnique({
            where: { id: koleksiId, userId: userId },
        });

        if (!koleksi) {
            return NextResponse.json(
                { error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." },
                { status: 403 }
            );
        }

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

// Menonaktifkan GET untuk menghindari pengambilan semua kartu tanpa filter
export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}