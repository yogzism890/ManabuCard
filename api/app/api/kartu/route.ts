import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — ambil semua kartu
export async function GET() {
  try {
    const data = await prisma.kartu.findMany({
      include: { koleksi: true }, // opsional lihat nama koleksinya
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

// POST — tambah kartu baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { koleksiId, front, back } = body;

    if (!koleksiId || !front || !back) {
      return NextResponse.json(
        { error: "koleksiId, front, back wajib diisi" },
        { status: 400 }
      );
    }

    const newCard = await prisma.kartu.create({
      data: {
        koleksiId,
        front,
        back,
      },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
