import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Pastikan path ke prisma client Anda benar

// ASUMSI: Anda memiliki mekanisme untuk mendapatkan ID Pengguna yang terotentikasi.
// Ganti logika ini dengan implementasi otentikasi Anda yang sebenarnya (misalnya, dari JWT).
const getAuthenticatedUserId = (): string | null => {
    // --- TEMPORARY MOCK ---
    // GANTI ini dengan userId yang benar dari sesi/token Anda
    return 'isi_dengan_id_pengguna_yang_valid'; 
    // -----------------------
};

/**
 * Endpoint GET /api/koleksi/[id]/kartu
 * Mengambil kartu-kartu yang jatuh tempo (reviewDueAt <= sekarang) dari koleksi tertentu.
 */
export async function GET(
  req: Request,
  context: { params: { id: string } } // Menerima parameter dinamis (id Koleksi)
) {
  const koleksiId = context.params.id;
  const userId = getAuthenticatedUserId();

  // 1. Pemeriksaan Otentikasi
  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED: User not authenticated." }, { status: 401 });
  }

  // 2. Pemeriksaan Parameter
  if (!koleksiId) {
    return NextResponse.json({ error: "Bad Request: Koleksi ID is required." }, { status: 400 });
  }

  try {
    const now = new Date();
    
    // 3. Query Prisma: Ambil Kartu yang jatuh tempo
    const kartuList = await prisma.kartu.findMany({
      where: {
        koleksiId: koleksiId,
        // Kriteria Spaced Repetition (SRS): Hanya ambil kartu yang jatuh tempo hari ini atau sebelumnya
        reviewDueAt: {
          lte: now, 
        },
        // Kriteria Keamanan: Pastikan koleksi tersebut milik pengguna yang terotentikasi
        koleksi: {
          userId: userId,
        },
      },
      // Pilih kolom yang diperlukan untuk mengurangi beban transfer data
      select: {
        id: true,
        front: true,
        back: true,
        difficulty: true,
        reviewDueAt: true,
      },
      // Urutkan untuk sesi belajar: Kartu yang paling lama jatuh tempo diutamakan
      orderBy: {
        reviewDueAt: 'asc', 
      }
    });

    // 4. Sukses: Kembalikan daftar kartu
    return NextResponse.json(kartuList, { status: 200 });

  } catch (e) {
    console.error("Error fetching cards for study session:", e);
    // 5. Error: Tangani kegagalan server
    return NextResponse.json(
      { error: "SERVER_ERROR: Failed to fetch cards." },
      { status: 500 }
    );
  }
}

// Menonaktifkan method lain jika tidak digunakan
export async function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}