import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // 1. Tangkap data yang dikirim dari HP
    const body = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "Email dan password wajib diisi"
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: "Password minimal 6 karakter"
      }, { status: 400 });
    }

    // 2. Hash password sebelum simpan ke database
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Simpan ke Database
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    // 4. Kirim balasan sukses ke HP (jangan kirim password)
    return NextResponse.json({
      success: true,
      message: "User berhasil dibuat!",
      data: { id: newUser.id, email: newUser.email }
    }, { status: 201 });

  } catch (error) {
    console.error("Error register:", error);

    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        message: "Email sudah terdaftar"
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: "Gagal membuat user"
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
