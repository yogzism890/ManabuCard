import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromAuthHeader } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Endpoint GET /api/koleksi/[id]: Mengambil detail koleksi spesifik.
 */
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    const params = await context.params;
    const koleksiId = params.id;

    if (!koleksiId) {
        return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
    }

    try {
        // Cek keamanan: Pastikan koleksi milik user ini
        const existingKoleksi = await prisma.koleksi.findFirst({
            where: { 
                id: koleksiId, 
                userId: userId 
            },
            include: {
                _count: {
                    select: { 
                        kartu: {
                            where: { isDeleted: false }
                        }
                    }
                }
            }
        });

        if (!existingKoleksi) {
            return NextResponse.json({ 
                error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." 
            }, { status: 403 });
        }

        // Hitung dueToday cards
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

        const formattedKoleksi = {
            id: existingKoleksi.id,
            name: existingKoleksi.nama,
            deskripsi: existingKoleksi.deskripsi,
            cardCount: existingKoleksi._count.kartu,
            dueToday: dueTodayCount,
            createdAt: existingKoleksi.createdAt,
        };

        return NextResponse.json(formattedKoleksi, { status: 200 });

    } catch (error) {
        console.error("Error fetching collection detail:", error);
        return NextResponse.json({ 
            error: "SERVER_ERROR: Gagal mengambil detail koleksi." 
        }, { status: 500 });
    }
}

/**
 * Endpoint PUT /api/koleksi/[id]: Memperbarui koleksi.
 */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    const params = await context.params;
    const koleksiId = params.id;

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
            return NextResponse.json({ 
                error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." 
            }, { status: 403 });
        }

        const updatedKoleksi = await prisma.koleksi.update({
            where: { id: koleksiId },
            data: { nama, deskripsi },
        });

        return NextResponse.json(updatedKoleksi, { status: 200 });
    } catch (error) {
        console.error("Error updating collection:", error);
        return NextResponse.json({ 
            error: "SERVER_ERROR: Gagal memperbarui koleksi." 
        }, { status: 500 });
    }
}

/**
 * Endpoint DELETE /api/koleksi/[id]: Menghapus koleksi.
 */
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserFromAuthHeader(authHeader);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    const params = await context.params;
    const koleksiId = params.id;

    try {
        // Cek kepemilikan
        const existingKoleksi = await prisma.koleksi.findFirst({
            where: { id: koleksiId, userId: userId },
        });

        if (!existingKoleksi) {
            return NextResponse.json({ 
                error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." 
            }, { status: 403 });
        }

        await prisma.koleksi.delete({
            where: { id: koleksiId },
        });

        return NextResponse.json({ message: "Koleksi berhasil dihapus." }, { status: 200 });
    } catch (error) {
        console.error("Error deleting collection:", error);
        return NextResponse.json({ 
            error: "SERVER_ERROR: Gagal menghapus koleksi." 
        }, { status: 500 });
    }
}
