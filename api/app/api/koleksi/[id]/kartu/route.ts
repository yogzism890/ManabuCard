import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path ke prisma client Anda benar

const getAuthenticatedUserId = (): string | null => {
    // HARAP GANTI DENGAN UUID USER YANG ADA DI DATABASE ANDA UNTUK TESTING
    return 'isi_dengan_id_pengguna_yang_valid'; 
};

/**
 * Endpoint GET /api/koleksi/[id]/kartu
 * Mengambil kartu-kartu yang jatuh tempo (reviewDueAt <= sekarang) dari koleksi tertentu.
 */
export async function GET(
  req: Request,
  context: { params: { id: string } } 
) {
  const koleksiId = context.params.id;
  const userId = getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
  }

  if (!koleksiId) {
    return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
  }

  try {
    const now = new Date();
    
    const kartuList = await prisma.kartu.findMany({
      where: {
        koleksiId: koleksiId,
        reviewDueAt: {
          lte: now, 
        },
        koleksi: {
          userId: userId, // Kriteria Keamanan
        },
      },
      select: {
        id: true,
        front: true,
        back: true,
        difficulty: true,
        reviewDueAt: true,
      },
      orderBy: {
        reviewDueAt: 'asc', 
      }
    });

    return NextResponse.json(kartuList, { status: 200 });

  } catch (e) {
    console.error("Error fetching cards for study session:", e);
    return NextResponse.json(
      { error: "SERVER_ERROR: Failed to fetch cards." },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}