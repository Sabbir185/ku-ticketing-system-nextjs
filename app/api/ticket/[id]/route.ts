import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
   const { id } = params;
    console.log("🚀 ~ GET ~ id:", id)
    const user = await verifyAuth(req);
    if (!user) {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json(
        { error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }





    // You could add support for USER too
    // if (user.role === "USER") {
    //   whereClause = { userId: user.id };
    // }
    const data = await prisma.ticket.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        user: true,
        employee: true,
        category: true,
      },
    })

    return NextResponse.json({ error: false, data }, { status: 200 });
  } catch (error) {
    console.error("GET tickets error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}
