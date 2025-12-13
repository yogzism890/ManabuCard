import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Endpoint PATCH /api/kartu/[id]: Memperbarui status SRS kartu.
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // ID Kartu
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    const { id: kartuId } = await params;

    if (!kartuId) {
        return NextResponse.json({ error: "Bad Request: Card ID is required." }, { status: 400 });
    }
    
    try {
        const body = await req.json();
        const { newDifficulty, newReviewDueAt } = body; 

        if (typeof newDifficulty === 'undefined' || !newReviewDueAt) {
            return NextResponse.json(
                { error: "Difficulty dan ReviewDueAt baru wajib diisi." },
                { status: 400 }
            );
        }

        // Cek Keamanan: Pastikan kartu milik user ini (melalui Koleksi)
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

        // Update Status Kartu
        const updatedKartu = await prisma.kartu.update({
            where: { id: kartuId }, 
            data: {
                difficulty: newDifficulty,
                reviewDueAt: new Date(newReviewDueAt),
            },
        });

        return NextResponse.json(updatedKartu, { status: 200 });

    } catch (e) {
        console.error("Error updating card SRS data:", e);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal update status kartu." }, { status: 500 });
    }
}

/**
 * Endpoint DELETE /api/kartu/[id]: Menghapus kartu (soft delete).
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    const { id: kartuId } = await params;

    try {
        // Cek kepemilikan
        const existingKartu = await prisma.kartu.findFirst({
            where: {
                id: kartuId,
                koleksi: { userId: userId },
            },
        });

        if (!existingKartu) {
            return NextResponse.json({ error: "FORBIDDEN: Kartu tidak ditemukan atau bukan milik user ini." }, { status: 403 });
        }

        // Soft delete
        await prisma.kartu.update({
            where: { id: kartuId },
            data: { isDeleted: true },
        });

        return NextResponse.json({ message: "Kartu berhasil dihapus." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting card:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal menghapus kartu." }, { status: 500 });
    }
}

// Menonaktifkan GET untuk kartu tunggal (opsional)
export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
