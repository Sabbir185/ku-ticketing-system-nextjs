import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
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
    // Get ticket 
    const ticket = await prisma.ticket.findUnique({
      where: { id: Number(formData.get("id")) },
      include: {
        category: true,
      },
    })
    // get ticket user
    const ticketUser = await prisma.user.findUnique({
      where: { id: ticket?.userId },
    })
    const { data, error } = await sendEmail({
      from: process.env.FROM_EMAIL!,
      to: [ticketUser?.email],
      subject: `Reply to Your Ticket #${ticket?.id}`,
      html: `
    <div style="font-family: Arial, sans-serif;  margin: 0 auto;">
      <h2 style="color: #333;">Ticket Management System</h2>
      <p>Hi ${ticketUser?.name},</p>
      <p>We've replied to your ticket:</p>
      <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #16a34a; margin: 16px 0;">
        <strong>${ticket?.category?.name}</strong><br/>
        <p style="margin-top: 12px;">${reply}</p>
      </div>
      <p style="color: #666;">You can respond to this message or manage the ticket from your dashboard.</p>
      <br/>
      <p style="color: #999; font-size: 12px;">Thanks for your patience!</p>
    </div>
  `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { status: 500, error: true, msg: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, msg: "Ticket created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("🚨 POST /ticket/add error:", error);
    return NextResponse.json(
      { error: true, msg: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}