import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

// ASUMSI: Anda memiliki middleware atau cara untuk mendapatkan ID pengguna (userId)
// Misalnya, dari token JWT di header Authorization.
// Untuk contoh ini, kita akan menggunakan userId statis sementara.
const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid'; // Ganti dengan logic auth sungguhan!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // 1. Dapatkan ID pengguna (Harus diimplementasikan dari sesi/token)
      const userId = MOCK_USER_ID; 

      // 2. Query Prisma: Ambil Koleksi beserta jumlah Kartu di dalamnya
      const koleksiList = await prisma.koleksi.findMany({
        where: { userId: userId },
        select: {
          id: true,
          nama: true,
          createdAt: true,
          // Ini menggunakan fitur aggregation Prisma
          _count: {
            select: { kartu: true }
          }
        }
      });

      // 3. Format Respons
      const formattedKoleksi = koleksiList.map(k => ({
        id: k.id,
        name: k.nama,
        cardCount: k._count.kartu,
      }));
      
      return res.status(200).json(formattedKoleksi);

    } catch (error) {
      console.error("Error fetching collections:", error);
      return res.status(500).json({ error: 'Gagal mengambil data koleksi dari database.' });
    }
  } else {
    // Metode HTTP tidak diizinkan
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}