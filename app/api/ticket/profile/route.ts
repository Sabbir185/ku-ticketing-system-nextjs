import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
// import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
// import path from "path";

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user ) {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json({ error: true, msg: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    // const image = formData.get("image") as File | null;

        // let filePath = null;
        // if (image && image.size > 0) {
        //   const arrayBuffer = await image.arrayBuffer();
        //   const buffer = Buffer.from(arrayBuffer);
        //   filePath = path.join(process.cwd(), "public/uploads", image.name);
        //   await writeFile(filePath, buffer);
        // }
    
    // update the user profile
    const ticket = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone,
        // image,
      },
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: unknown) {
    console.error("🚨 POST /ticket/add error:", error);
    let errorMessage = "Failed to create ticket";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: true, msg: errorMessage },
      { status: 500 }
    );
  }
}
