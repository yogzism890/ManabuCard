import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint GET /api/koleksi/[id]: Mengambil detail koleksi spesifik.
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
        // Ambil detail koleksi dan hitung statistics
        const koleksi = await prisma.koleksi.findFirst({
            where: { 
                id: koleksiId,
                userId: userId 
            },
            select: {
                id: true,
                nama: true,
                deskripsi: true,
                createdAt: true,
                _count: {
                    select: { kartu: true }
                }
            }
        });

        if (!koleksi) {
            return NextResponse.json({ error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." }, { status: 403 });
        }

        // Hitung due today cards
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dueTodayCount = await prisma.kartu.count({
            where: {
                koleksiId: koleksiId,
                isDeleted: false,
                reviewDueAt: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        return NextResponse.json({
            id: koleksi.id,
            name: koleksi.nama,
            description: koleksi.deskripsi,
            cardCount: koleksi._count.kartu,
            dueToday: dueTodayCount,
            createdAt: koleksi.createdAt,
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching collection detail:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal mengambil detail koleksi." }, { status: 500 });
    }
}

/**
 * Endpoint PUT /api/koleksi/[id]: Memperbarui koleksi.
 */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;
    const { id: koleksiId } = await params;

    try {
        const body = await req.json();
        const { nama, deskripsi } = body;

        if (!nama) {
            return NextResponse.json({ error: "Nama koleksi wajib diisi." }, { status: 400 });
        }

        // Cek kepemilikan
        const existingKoleksi = await prisma.koleksi.findFirst({
            where: { id: koleksiId, userId: userId },
        });

        if (!existingKoleksi) {
            return NextResponse.json({ error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." }, { status: 403 });
        }

        const updatedKoleksi = await prisma.koleksi.update({
            where: { id: koleksiId },
            data: { nama, deskripsi },
        });

        return NextResponse.json(updatedKoleksi, { status: 200 });
    } catch (error) {
        console.error("Error updating collection:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal memperbarui koleksi." }, { status: 500 });
    }
}

/**
 * Endpoint DELETE /api/koleksi/[id]: Menghapus koleksi.
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;
    const { id: koleksiId } = await params;

    try {
        // Cek kepemilikan
        const existingKoleksi = await prisma.koleksi.findFirst({
            where: { id: koleksiId, userId: userId },
        });

        if (!existingKoleksi) {
            return NextResponse.json({ error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." }, { status: 403 });
        }

        await prisma.koleksi.delete({
            where: { id: koleksiId },
        });

        return NextResponse.json({ message: "Koleksi berhasil dihapus." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting collection:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal menghapus koleksi." }, { status: 500 });
    }
}
