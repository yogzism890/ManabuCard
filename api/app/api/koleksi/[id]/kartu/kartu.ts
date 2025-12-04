import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
// ASUMSI: MOCK_USER_ID sama seperti di atas
const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // 1. Ambil Koleksi ID dari URL (dynamic routing)
    const { koleksiId } = req.query;

    if (typeof koleksiId !== 'string') {
      return res.status(400).json({ error: 'Koleksi ID tidak valid.' });
    }

    try {
      // 2. Ambil semua Kartu dari Koleksi ID tersebut
      // Penting: Anda mungkin ingin menambahkan filter `reviewDueAt` 
      // di sini agar hanya mengambil kartu yang jatuh tempo hari ini atau sebelumnya.
      const now = new Date();
      
      const kartuList = await prisma.kartu.findMany({
        where: {
          koleksiId: koleksiId,
          // Hanya ambil kartu yang seharusnya di-review (reviewDueAt <= hari ini)
          reviewDueAt: {
            lte: now,
          },
          // Pastikan koleksi tersebut milik pengguna yang login (Keamanan!)
          koleksi: {
            userId: MOCK_USER_ID, // Ganti dengan logic auth sungguhan!
          }
        },
        // Ambil semua kolom yang diperlukan untuk sesi belajar
        select: {
          id: true,
          front: true,
          back: true,
          difficulty: true,
          reviewDueAt: true,
        },
        // Urutkan berdasarkan yang paling lama jatuh tempo atau difficulty terendah
        orderBy: {
            reviewDueAt: 'asc', 
        }
      });
      
      // 3. Kembalikan Daftar Kartu
      return res.status(200).json(kartuList);

    } catch (error) {
      console.error("Error fetching cards:", error);
      return res.status(500).json({ error: 'Gagal mengambil kartu untuk sesi belajar.' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}