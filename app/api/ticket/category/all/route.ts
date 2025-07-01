import { prisma } from "@/lib/prisma";
import {  NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    const data =categories
    return NextResponse.json({ error: false, data }, { status: 200 });
  } catch (error) {
    console.error("GET categories error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}