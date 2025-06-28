import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
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
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: true, msg: "Name is required" }, { status: 400 });
    }
    // check if category already exists
    const existingCategory = await prisma.category.findFirst({ where: { name } });
    if (existingCategory) {
      return NextResponse.json({ error: true, msg: "Category already exists" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return NextResponse.json({ error: true, msg: "Failed to create category" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [docs, totalDocs] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.count(),
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
    console.error("GET categories error:", error);
    return NextResponse.json(
      { error: true, msg: "Failed to fetch categories" },
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
    console.log("🚀 ~ DELETE ~ id:", id)
    if (!id) {
      return NextResponse.json(
        { status: 400, error: true, msg: "Missing id parameter" },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id : Number(id) } });
    return NextResponse.json(
      { status: 200, error: false, msg: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE category error:", error);
    return NextResponse.json(
      { status: 500, error: true, msg: "Failed to delete category" },
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
    await prisma.category.update({ where: { id: Number(id) }, data: { name } });
    return NextResponse.json(
      { status: 200, error: false, msg: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT category error:", error);
    return NextResponse.json(
      { status: 500, error: true, msg: "Failed to update category" },
      { status: 500 }
    );
  }
}