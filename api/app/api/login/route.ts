import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Endpoint POST /api/login: Login pengguna.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
        }

        // Generate JWT token (gunakan secret dari env)
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

        return NextResponse.json({
            message: "Login berhasil.",
            token,
            user: { id: user.id, email: user.email },
        }, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal login." }, { status: 500 });
    }
}
