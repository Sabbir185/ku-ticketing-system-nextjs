import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user || user?.role !== "USER") {
            logEvent(
                "Unauthorized access",
                "auth",
                { user: "unauthorized" },
                "warning"
            );
            return NextResponse.json(
                { error: true, msg: "Unauthorized access" },
                { status: 401 }
            );
        }
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [docs, totalDocs] = await Promise.all([
            prisma.ticket.findMany({
                where: {
                    userId: user.id
                },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    category: true,
                    user: true,
                    employee: true,
                },
            }),
            prisma.ticket.count(),
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