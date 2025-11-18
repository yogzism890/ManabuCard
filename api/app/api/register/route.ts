import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Pastikan path ini sesuai dengan file prisma.ts kamu

export async function POST(request: Request) {
  try {
    // 1. Tangkap data yang dikirim dari HP
    const body = await request.json();
    const { email, password } = body;

    // 2. Simpan ke Database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: password, // Note: Nanti sebaiknya di-hash pakai bcrypt
      },
    });

    // 3. Kirim balasan sukses ke HP
    return NextResponse.json({ 
      success: true, 
      message: "User berhasil dibuat!", 
      data: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error("Error register:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal membuat user (Email mungkin sudah ada)" 
    }, { status: 500 });
  }
}