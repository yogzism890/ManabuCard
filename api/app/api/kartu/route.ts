import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserOrDefault } from "@/lib/simple-auth";
import { headers } from "next/headers";

/**
 * Endpoint POST /api/kartu: Menambahkan kartu baru ke koleksi tertentu.
 * Mendukung kartu TEXT dan IMAGE.
 */
export async function POST(req: Request) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;

    try {
        const body = await req.json();
        const { 
            koleksiId, 
            type = "TEXT",
            frontText, 
            backText, 
            frontImageUrl, 
            backImageUrl,
            // Legacy fields for backward compatibility
            front, 
            back 
        } = body;

        // Validasi dasar
        if (!koleksiId) {
            return NextResponse.json(
                { error: "Koleksi ID wajib diisi." },
                { status: 400 }
            );
        }

        // Cek Keamanan: Pastikan Koleksi milik User yang login
        const koleksi = await prisma.koleksi.findUnique({
            where: { id: koleksiId, userId: userId },
        });

        if (!koleksi) {
            return NextResponse.json(
                { error: "FORBIDDEN: Koleksi tidak ditemukan atau bukan milik user ini." },
                { status: 403 }
            );
        }

        // Validasi berdasarkan type
        if (type === "TEXT") {
            // Untuk TEXT: minimal frontText atau legacy front harus ada
            const hasFront = (frontText && frontText.trim() !== "") || (front && front.trim() !== "");
            if (!hasFront) {
                return NextResponse.json(
                    { error: "Front (teks pertanyaan) wajib diisi untuk kartu TEXT." },
                    { status: 400 }
                );
            }
        } else if (type === "IMAGE") {
            // Untuk IMAGE: minimal salah satu image harus ada
            const hasFrontImage = frontImageUrl && frontImageUrl.trim() !== "";
            const hasBackImage = backImageUrl && backImageUrl.trim() !== "";
            if (!hasFrontImage && !hasBackImage) {
                return NextResponse.json(
                    { error: "Minimal satu gambar (Front atau Back) wajib diisi untuk kartu IMAGE." },
                    { status: 400 }
                );
            }
        }

        // Buat Kartu Baru dengan field baru
        const newKartu = await prisma.kartu.create({
            data: {
                koleksiId,
                type,
                frontText: frontText || null,
                backText: backText || null,
                frontImageUrl: frontImageUrl || null,
                backImageUrl: backImageUrl || null,
                // Legacy fields
                front: front || frontText || null,
                back: back || backText || null,
                difficulty: 0,
                reviewDueAt: new Date(),
            },
        });

        return NextResponse.json(newKartu, { status: 201 });

    } catch (e) {
        console.error("Error creating new card:", e);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal membuat kartu." }, { status: 500 });
    }
}

/**
 * Endpoint GET /api/kartu: Mengambil semua kartu pengguna (opsional, dengan filter koleksi).
 */
export async function GET(req: Request) {
    const authHeader = (await headers()).get('authorization');
    const user = getUserOrDefault(authHeader);
    const userId = user.userId;

    try {
        const url = new URL(req.url);
        const koleksiId = url.searchParams.get('koleksiId');
        const cardType = url.searchParams.get('type'); // Optional: filter by type (TEXT/IMAGE)

        interface WhereClause {
            koleksi: { userId: string };
            isDeleted: boolean;
            koleksiId?: string;
            type?: string;
        }

        const whereClause: WhereClause = {
            koleksi: { userId: userId },
            isDeleted: false,
        };

        if (koleksiId) {
            whereClause.koleksiId = koleksiId;
        }

        if (cardType && (cardType === "TEXT" || cardType === "IMAGE")) {
            whereClause.type = cardType;
        }

        const kartuList = await prisma.kartu.findMany({
            where: whereClause,
            select: {
                id: true,
                type: true,
                frontText: true,
                backText: true,
                frontImageUrl: true,
                backImageUrl: true,
                // Legacy fields
                front: true,
                back: true,
                difficulty: true,
                reviewDueAt: true,
                koleksiId: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(kartuList, { status: 200 });
    } catch (error) {
        console.error("Error fetching cards:", error);
        return NextResponse.json({ error: "SERVER_ERROR: Gagal mengambil kartu." }, { status: 500 });
    }
}
