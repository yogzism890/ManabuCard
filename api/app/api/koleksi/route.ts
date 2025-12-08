import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";



/**
 * Endpoint GET /api/koleksi: Mengambil daftar koleksi pengguna beserta jumlah kartu.
 */
export async function GET(req: Request) {
    const user = getUserFromRequest(req);

    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;

    try {
        const koleksiList = await prisma.koleksi.findMany({
            where: { userId: userId },
            select: {
                id: true,
                nama: true,
                createdAt: true,
                _count: {
                    select: { kartu: true } // Hitung jumlah kartu
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Format data: Backend belum bisa menghitung 'dueToday' dengan efisien di Prisma findMany.
        // Frontend harus menghitung ini di tempat lain, atau kita kembalikan 0.
        const formattedKoleksi = koleksiList.map((k: any) => ({
            id: k.id,
            name: k.nama,
            cardCount: k._count.kartu,
            dueToday: 0, // Implementasi dueToday memerlukan query tambahan. Diberi 0 sementara.
        }));
        
        return NextResponse.json(formattedKoleksi, { status: 200 });

    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json({ error: 'SERVER_ERROR: Gagal mengambil data koleksi.' }, { status: 500 });
    }
}

/**
 * Endpoint POST /api/koleksi: Membuat koleksi baru.
 */
export async function POST(req: Request) {
    const user = getUserFromRequest(req);
    if (!user) {
        return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
    }

    const userId = user.userId;
    
    try {
        const body = await req.json();
        const { nama } = body;

        if (!nama) {
            return NextResponse.json(
                { error: "Nama koleksi wajib diisi." },
                { status: 400 }
            );
        }

        const newKoleksi = await prisma.koleksi.create({
            data: { nama, userId },
        });

        return NextResponse.json(newKoleksi, { status: 201 });
    } catch (error) {
        console.error("Error creating new collection:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal membuat koleksi." }, { status: 500 });
    }
}