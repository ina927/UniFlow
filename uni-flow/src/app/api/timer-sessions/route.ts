import { NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startTime, endTime, userId, todoId } = body;

    // Validate required fields
    if (!startTime || !endTime || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { success: false, error: "Invalid date format" },
        { status: 400 }
      );
    }

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: "Start time must be before end time" },
        { status: 400 }
      );
    }

    // Check user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User does not exist" },
        { status: 400 }
      );
    }

    // Check todo exists (if provided)
    if (todoId) {
      const todo = await prisma.toDo.findUnique({ where: { id: todoId } });
      if (!todo) {
        return NextResponse.json(
          { success: false, error: "Todo does not exist" },
          { status: 400 }
        );
      }
    }

    // Create timer session
    const timerSession = await prisma.timerSession.create({
      data: {
        startTime: start,
        endTime: end,
        userId,
        ...(todoId && { todoId }),
      },
    });

    return NextResponse.json({ success: true, timerSession });
  } catch (error) {
    console.error("Error saving timer session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save timer session" },
      { status: 500 }
    );
  }
}
