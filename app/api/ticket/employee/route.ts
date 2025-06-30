import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// CREATE new category
export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || user?.role !== "ADMIN") {
      logEvent(
        "Unauthorized access",
        "auth",
        { user: "unauthorized" },
        "warning"
      );
      return NextResponse.json(
        { status: 401, error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }
    const body = await req.json();
    console.log("🚀 ~ POST ~ body:", body)
    const { name,email,phone,password,role,department } = body;
  
    // check if category already exists
    const existingEmployee = await prisma.user.findFirst({ where: { email } });
    if (existingEmployee) {
      return NextResponse.json({ error: true, msg: "Employee already exists" }, { status: 400 });
    }
const hashedPassword = await bcrypt.hash(password, 10);
    const departments = JSON.parse(department);
   const employee = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    phone,
    role,
    departments: {
      connect: departments.map((id: number) => ({ id })),
    },
  },
});

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json({ error: true, msg: "Failed to create employee" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      prisma.user.findMany({
         where: {
       role: "EMPLOYEE",
    },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
      departments: true, // 👈 include departments here
    },
      }),
      prisma.user.count({
        where: {
          role: "EMPLOYEE",
        },
      }),
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
    console.error("GET employees error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to fetch Employees" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || user?.role !== "ADMIN") {
      logEvent(
        "Unauthorized access",
        "auth",
        { user: "unauthorized" },
        "warning"
      );
      return NextResponse.json(
        { status: 401, error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { status: 400, error: true, msg: "Missing id parameter" },
        { status: 400 }
      );  
    }
    await prisma.user.update({
  where: { id: Number(id) },
  data: {
    departments: {
      set: [], // disconnect all categories
    },
  },
});
    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json(
      { status: 200, error: false, msg: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE employee error:", error);
    return NextResponse.json(
      { status: 500, error: true, msg: "Failed to delete employee" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user || user?.role !== "ADMIN") {
      logEvent(
        "Unauthorized access",
        "auth",
        { user: "unauthorized" },
        "warning"
      );
      return NextResponse.json(
        { status: 401, error: true, msg: "Unauthorized access" },
        { status: 401 }
      );
    }
    const body = await req.json();
    const { id, name } = body;
    if (!id) {
      return NextResponse.json(
        { status: 400, error: true, msg: "Missing id parameter" },
        { status: 400 }
      );
    }
    if (!name) {
      return NextResponse.json(
        { status: 400, error: true, msg: "Missing name parameter" },
        { status: 400 }
      );
    }
    await prisma.user.update({ where: { id: Number(id) }, data: { name } });
    return NextResponse.json(
      { status: 200, error: false, msg: "Employee updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH employee error:", error);
    return NextResponse.json(
      { status: 500, error: true, msg: "Failed to update employee" },
      { status: 500 }
    );
  }
}