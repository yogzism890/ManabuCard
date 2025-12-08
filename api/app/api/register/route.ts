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

// GET endpoint to create a test user for development
export async function GET() {
  try {
    const testUser = await prisma.user.upsert({
      where: { id: '550e8400-e29b-41d4-a716-446655440000' },
      update: {},
      create: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        password: 'password123'
      }
    });

    return NextResponse.json({
      success: true,
      message: "Test user created/updated",
      data: testUser
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to create test user"
    }, { status: 500 });
  }
}
