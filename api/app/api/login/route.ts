import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
            return NextResponse.json({ success: false, message: "Email atau password salah." }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ success: false, message: "Email atau password salah." }, { status: 401 });
        }

        // Return simple token format: userId:email (sesuai dengan simple-auth system)
        const simpleToken = `${user.id}:${user.email}`;

        return NextResponse.json({
            success: true,
            message: "Login berhasil.",
            userId: user.id,
            user: { id: user.id, email: user.email },
        }, { status: 200 });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ success: false, message: "SERVER_ERROR: Gagal login." }, { status: 500 });
    }
}
