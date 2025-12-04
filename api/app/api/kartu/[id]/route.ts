import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ASUMSI: Fungsi mock untuk mendapatkan ID Pengguna yang terotentikasi.
const getAuthenticatedUserId = (): string | null => {
    return 'isi_dengan_id_pengguna_yang_valid'; 
};

/**
 * Endpoint PATCH /api/kartu/[id]
 * Memperbarui status SRS kartu (difficulty dan reviewDueAt).
 */
export async function PATCH(
    req: Request,
    context: { params: { id: string } } // ID Kartu
) {
    const kartuId = context.params.id;
    const userId = getAuthenticatedUserId();

    // 1. Pemeriksaan Otentikasi
    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    // 2. Pemeriksaan Parameter
    if (!kartuId) {
        return NextResponse.json({ error: "Bad Request: Card ID is required." }, { status: 400 });
    }
    
    try {
        const body = await req.json();
        // newDifficulty dan newReviewDueAt dihitung di frontend (study/[id].tsx)
        const { newDifficulty, newReviewDueAt } = body; 

        // 3. Validasi Input
        if (typeof newDifficulty === 'undefined' || !newReviewDueAt) {
            return NextResponse.json(
                { error: "Difficulty dan ReviewDueAt baru wajib diisi." },
                { status: 400 }
            );
        }

        // 4. Cek Keamanan: Pastikan kartu milik user ini (melalui Koleksi)
        // Kita gunakan findFirstOrThrow untuk memastikan kartu ada DAN dimiliki oleh user.
        const existingKartu = await prisma.kartu.findFirst({
            where: {
                id: kartuId,
                koleksi: {
                    userId: userId,
                },
            },
        });

        if (!existingKartu) {
            return NextResponse.json(
                { error: "FORBIDDEN: Kartu tidak ditemukan atau bukan milik user ini." },
                { status: 403 }
            );
        }

        // 5. Update Status Kartu
        const updatedKartu = await prisma.kartu.update({
            where: { id: kartuId }, // Kita tahu ID kartu itu valid dari pemeriksaan di atas
            data: {
                difficulty: newDifficulty,
                reviewDueAt: new Date(newReviewDueAt),
            },
        });

        return NextResponse.json(updatedKartu, { status: 200 });

    } catch (e) {
        console.error("Error updating card SRS data:", e);
        return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
    }
}

// Menonaktifkan method lain
export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}