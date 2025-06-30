import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || (user?.role !== "EMPLOYEE" && user?.role !== "ADMIN")) {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json({ error: true, msg: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();

    const reply = formData.get("reply") as string;
    const file = formData.get("file") as File | null;

    if (!reply) {
      return NextResponse.json({ error: true, msg: "Missing required fields" }, { status: 400 });
    }

    let filePath = null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      filePath = path.join(process.cwd(), "public/uploads", file.name);
      await writeFile(filePath, buffer);
    }

    await prisma.ticket.update({
      where: { id: Number(formData.get("id")) },
      data: {
        reply,
        replyFile: filePath,
        status: "closed",
      },
    });

    return NextResponse.json({ success: true, msg: "Ticket created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("🚨 POST /ticket/add error:", error);
    return NextResponse.json(
      { error: true, msg: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}