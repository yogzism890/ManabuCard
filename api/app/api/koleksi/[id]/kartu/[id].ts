// pages/api/kartu/[id].ts (Untuk update data SRS)

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
// ASUMSI: MOCK_USER_ID sama seperti sebelumnya
// HARAP GANTI dengan logika otentikasi sungguhan!
const MOCK_USER_ID = 'isi_dengan_id_pengguna_yang_valid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  if (req.method === 'PATCH') {
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'Card ID tidak valid.' });
    }
    
    // Data yang dikirim dari frontend (dihitung oleh frontend)
    const { newDifficulty, newReviewDueAt } = req.body; 

    try {
      const updatedCard = await prisma.kartu.update({
        where: { 
          id: id,
          // Tambahkan pemeriksaan keamanan agar user hanya bisa mengupdate kartu miliknya
          koleksi: {
            userId: MOCK_USER_ID,
          }
        },
        data: {
          difficulty: newDifficulty,
          reviewDueAt: new Date(newReviewDueAt), // Pastikan format tanggal valid
          // Anda juga bisa menambahkan `updatedAt` otomatis di model Prisma
        },
      });

      // Kembalikan status sukses atau kartu yang diperbarui
      return res.status(200).json({ message: 'Card updated successfully', cardId: updatedCard.id });

    } catch (error) {
      console.error("Error updating card:", error);
      return res.status(500).json({ error: 'Gagal memperbarui status kartu.' });
    }
  } else {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}