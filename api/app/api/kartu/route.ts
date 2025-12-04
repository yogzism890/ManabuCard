import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path ke prisma client Anda benar

// ASUMSI: Fungsi mock untuk mendapatkan ID Pengguna yang terotentikasi.
// GANTI ini dengan implementasi otentikasi Anda yang sebenarnya!
const getAuthenticatedUserId = (): string | null => {
    return 'isi_dengan_id_pengguna_yang_valid'; 
};

/**
 * Endpoint POST /api/kartu
 * Digunakan untuk menambahkan kartu baru ke koleksi tertentu.
 */
export async function POST(req: Request) {
    const userId = getAuthenticatedUserId();

    // 1. Pemeriksaan Otentikasi
    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { koleksiId, front, back } = body;

        // 2. Pemeriksaan Data Input
        if (!koleksiId || !front || !back) {
            return NextResponse.json(
                { error: "Koleksi ID, front, dan back wajib diisi." },
                { status: 400 }
            );
        }

        // 3. Pemeriksaan Keamanan: Pastikan Koleksi milik User yang login
        const koleksi = await prisma.koleksi.findUnique({
            where: { id: koleksiId, userId: userId },
        });

        if (!koleksi) {
            return NextResponse.json(
                { error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." },
                { status: 403 }
            );
        }

        // 4. Buat Kartu Baru
        const newKartu = await prisma.kartu.create({
            data: { 
                koleksiId, 
                front, 
                back,
                // Inisialisasi SRS: Kartu baru harus di-review hari ini juga (default(now()) di skema Prisma)
                difficulty: 0, 
                reviewDueAt: new Date(), 
            },
        });

        return NextResponse.json(newKartu, { status: 201 });

    } catch (e) {
        console.error("Error creating new card:", e);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}

// Menonaktifkan GET untuk menghindari pengambilan semua kartu tanpa filter.
export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}