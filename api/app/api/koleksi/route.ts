import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.koleksi.findMany({
      include: { kartu: true },
    });
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, userId } = body;

    if (!nama || !userId) {
      return NextResponse.json(
        { error: "nama dan userId wajib diisi" },
        { status: 400 }
      );
    }

    const newKoleksi = await prisma.koleksi.create({
      data: { nama, userId },
    });

    return NextResponse.json(newKoleksi, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}
