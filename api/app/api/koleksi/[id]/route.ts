import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid';
const getAuthenticatedUserId = () => MOCK_USER_ID;

/**
 * Endpoint PUT /api/koleksi/[id]: Memperbarui koleksi.
 */
export async function PUT(
    req: Request,
    context: { params: { id: string } }
) {
    const koleksiId = context.params.id;
    const userId = getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

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
    context: { params: { id: string } }
) {
    const koleksiId = context.params.id;
    const userId = getAuthenticatedUserId();

    if (!userId) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

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
