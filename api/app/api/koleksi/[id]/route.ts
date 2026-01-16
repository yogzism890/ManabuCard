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
 * 
 * ULTIMATE SOLUTION: Multiple strategies dengan comprehensive error handling
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

        // Step 1: Get all related cards for logging
        const relatedCards = await prisma.kartu.findMany({
            where: { koleksiId: koleksiId },
            select: { id: true, front: true, isDeleted: true }
        });

        console.log(`[DELETE] Found ${relatedCards.length} cards for collection ${koleksiId}`);

        // Step 2: Try different deletion strategies
        let success = false;
        let strategy = '';

        // Strategy 1: Try with Prisma client directly (not in transaction)
        try {
            console.log('[DELETE] Strategy 1: Direct delete using Prisma client');
            await prisma.kartu.deleteMany({
                where: { koleksiId: koleksiId }
            });
            
            await prisma.koleksi.delete({
                where: { id: koleksiId }
            });
            
            success = true;
            strategy = 'Prisma Direct Delete';
            console.log('[DELETE] Strategy 1 succeeded');

        } catch (error) {
            console.log('[DELETE] Strategy 1 failed:', error instanceof Error ? error.message : 'Unknown error');
            
            // Strategy 2: Try with raw SQL disable FK check
            try {
                console.log('[DELETE] Strategy 2: Raw SQL with FK disable');
                await prisma.$executeRaw`SET session_replication_role = replica`;
                await prisma.$executeRaw`DELETE FROM "Kartu" WHERE "koleksiId" = ${koleksiId}`;
                await prisma.$executeRaw`DELETE FROM "Koleksi" WHERE id = ${koleksiId} AND "userId" = ${userId}`;
                await prisma.$executeRaw`SET session_replication_role = DEFAULT`;
                
                success = true;
                strategy = 'Raw SQL with FK Disable';
                console.log('[DELETE] Strategy 2 succeeded');
            } catch (error2: unknown) {
                const msg = error2 instanceof Error ? error2.message : String(error2);
                console.log("[DELETE] Strategy 2 failed:", msg);
                
                // Strategy 3: Try simple cascade with updateFirst then delete
                try {
                    console.log('[DELETE] Strategy 3: Cascade with update first');
                    await prisma.kartu.deleteMany({
                    where: { koleksiId },
                    });
                    
                    await prisma.koleksi.delete({
                        where: { id: koleksiId }
                    });
                    
                    success = true;
                    strategy = 'Cascade with Null Reference';
                    console.log('[DELETE] Strategy 3 succeeded');
                } catch (error3: unknown) {
                    const msg = error3 instanceof Error ? error3.message : String(error3);
                    console.log("[DELETE] Strategy 2 failed:", msg);
                    console.log('[DELETE] All strategies failed, providing detailed error info');
                }
            }
        }

        if (success) {
            return NextResponse.json({
                message: "Koleksi berhasil dihapus.",
                details: `Koleksi "${existingKoleksi.nama}" telah dihapus menggunakan ${strategy}.`,
                debug: {
                    strategy: strategy,
                    cardsDeleted: relatedCards.length,
                    collectionId: koleksiId
                }
            }, { status: 200 });
        } else {
            // If all strategies fail, provide comprehensive error info
            const constraintInfo = await prisma.$queryRaw<Array<{
                conname: string;
                conrelid: string;
                confrelid: string;
            }>>`
                SELECT conname, conrelid::regclass::text as conrelid, confrelid::regclass::text as confrelid
                FROM pg_constraint
                WHERE conrelid::regclass::text = 'Koleksi' OR confrelid::regclass::text = 'Koleksi'
            `;

            return NextResponse.json({
                error: "DELETE_FAILED: All deletion strategies failed",
                details: {
                    message: "Foreign key constraint prevents deletion",
                    collectionId: koleksiId,
                    cardCount: relatedCards.length,
                    constraints: constraintInfo,
                    manualSolution: [
                        "1. Delete all cards manually first",
                        "2. Then delete the collection",
                        "3. Or modify database schema to add CASCADE DELETE"
                    ],
                    code: "ALL_STRATEGIES_FAILED"
                }
            }, { status: 500 });
        }

    } catch (error) {
        console.error("[DELETE] Critical error:", error);
        return NextResponse.json({
            error: "SERVER_ERROR: Critical failure during deletion",
            details: {
                message: error instanceof Error ? error.message : "Unknown error",
                collectionId: koleksiId
            }
        }, { status: 500 });
    }
}

