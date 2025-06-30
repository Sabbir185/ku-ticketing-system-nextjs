import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/verify";
import { logEvent } from "@/utils/sentry";
import { NextRequest, NextResponse } from "next/server";

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


    // get all tickets count 
    const totalTickets = await prisma.ticket.count();

    // get all open tickets count 
    const openTickets = await prisma.ticket.count({
      where: {
        status: "open"
      }
    });

    // get all closed tickets count 
    const closedTickets = await prisma.ticket.count({
      where: {
        status: "closed"
      }
    });

    // get all high priority tickets count 
    const highPriorityTickets = await prisma.ticket.count({
      where: {
        priority: "high"
      }
    });

    // get all low priority tickets count 
    const lowPriorityTickets = await prisma.ticket.count({
      where: {
        priority: "low"
      }
    });

    // get all medium priority tickets count 
    const mediumPriorityTickets = await prisma.ticket.count({
      where: {
        priority: "medium"
      }
    });


    const data = {
      totalTickets,
      openTickets,
      closedTickets,
      highPriorityTickets,
      lowPriorityTickets,
      mediumPriorityTickets
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