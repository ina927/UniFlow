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

    // Save the timer session
    const timerSession = await prisma.timerSession.create({
      data: {
        startTime,
        endTime,
        userId,
        todoId,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch timer sessions with related ToDo and Subject details
    const timerSessions = await prisma.timerSession.findMany({
      where: { userId },
      include: {
        todo: {
          include: {
            subject: true, // Include the related subject details
          },
        },
      },
      orderBy: { startTime: "desc" },
    });

    return NextResponse.json({ success: true, timerSessions });
  } catch (error) {
    console.error("Error fetching timer sessions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timer sessions" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Delete all timer sessions for the user
    await prisma.timerSession.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true, message: "History cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear history" },
      { status: 500 }
    );
  }
}

/*
export async function POST(request: Request) {
  try {
    const { newToDo } = await request.json();

    // Ensure endDate is in ISO-8601 format
    if (newToDo.endDate) {
      newToDo.endDate = new Date(newToDo.endDate).toISOString();
    }

    const toDo = await prisma.toDo.create({
      data: newToDo,
    });

    return NextResponse.json({ success: true, toDo });
  } catch (error) {
    console.error("Error creating ToDo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create ToDo" },
      { status: 500 }
    );
  }
}
  */
