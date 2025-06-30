import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile } from "fs/promises";
import path from "path";

const ticketSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(5),
    priority: z.string().optional(),
    categoryId: z.number().optional()
});
// CREATE new category
// export async function uploadFileToCloudinary(file: File) {
//  if (file) {
//       const data = await fs.readFile(file.filepath);
//       const filePath = path.join(process.cwd(), "public/uploads", file.originalFilename);
//       await writeFile(filePath, data);
//     }
// }

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || user?.role !== "USER") {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json({ error: true, msg: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const categoryId = Number(formData.get("categoryId"));
    const file = formData.get("file") as File | null;
    console.log("🚀 ~ POST ~ file:", file)

    if (!title || !description || !categoryId) {
      return NextResponse.json({ error: true, msg: "Missing required fields" }, { status: 400 });
    }

    const validated = ticketSchema.parse({ title, description, priority, categoryId });
    let filePath = null;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      filePath = path.join(process.cwd(), "public/uploads", file.name);
      await writeFile(filePath, buffer);
    }

    const employees = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        departments: {
          some: { id: categoryId },
        },
      },
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { error: true, msg: "No employees found for this category" },
        { status: 400 }
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: validated.title,
        description: validated.description,
        priority: validated.priority || "normal",
        categoryId,
        userId: user.id,
        employeeId: employees[0].id,
        file: filePath, // 📎 Save the uploaded file URL
      },
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error: any) {
    console.error("🚨 POST /ticket/add error:", error);
    return NextResponse.json(
      { error: true, msg: error.message || "Failed to create ticket" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json(
        { error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Base where condition
    let whereClause = {};

    // Filter tickets based on role
    if (user.role === "EMPLOYEE") {
      whereClause = { employeeId: user.id };
    }

    // You could add support for USER too
    // if (user.role === "USER") {
    //   whereClause = { userId: user.id };
    // }

    const [docs, totalDocs] = await Promise.all([
      prisma.ticket.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          user: true,
          employee: true,
        },
      }),
      prisma.ticket.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);
    const data = {
      docs,
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return NextResponse.json({ error: false, data }, { status: 200 });
  } catch (error) {
    console.error("GET tickets error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
        const body = await req.json();
    const { id } = body;
    const user = await verifyAuth(req);
    if (!user) {
      logEvent("Unauthorized access", "auth", { user: "unauthorized" }, "warning");
      return NextResponse.json(
        { error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }

    const ticket = await prisma.ticket.findUnique({ where: { id: Number(id) } });
    if (!ticket) {
      return NextResponse.json(
        { error: true, msg: "Ticket not found" },
        { status: 404 }
      );
    }

    await prisma.ticket.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { error: false, msg: "Ticket deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE ticket error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to delete ticket" },
      { status: 500 }
    );
  }
}

