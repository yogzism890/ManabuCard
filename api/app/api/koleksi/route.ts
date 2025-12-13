import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint GET /api/koleksi: Mengambil daftar koleksi pengguna beserta jumlah kartu.
 */
export async function GET(req: Request) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;

    try {
        const koleksiList = await prisma.koleksi.findMany({
            where: { userId: userId },
            select: {
                id: true,
                nama: true,
                createdAt: true,
                _count: {
                    select: { kartu: true }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });


        // Format data: Hitung dueToday cards
        const formattedKoleksi = await Promise.all(
            koleksiList.map(async (k) => {
                // Hitung kartu yang due today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const dueTodayCount = await prisma.kartu.count({
                    where: {
                        koleksiId: k.id,
                        isDeleted: false,
                        reviewDueAt: {
                            gte: today,
                            lt: tomorrow
                        }
                    }
                });

                return {
                    id: k.id,
                    name: k.nama,
                    cardCount: k._count.kartu,
                    dueToday: dueTodayCount,
                };
            })
        );
        
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
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;
    
    try {
        const body = await req.json();
        const { nama, deskripsi } = body;

        if (!nama) {
            return NextResponse.json(
                { error: "Nama koleksi wajib diisi." },
                { status: 400 }
            );
        }

        const newKoleksi = await prisma.koleksi.create({
            data: { nama, deskripsi, userId },
        });

        return NextResponse.json(newKoleksi, { status: 201 });
    } catch (error) {
        console.error("Error creating new collection:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal membuat koleksi." }, { status: 500 });
    }
}
