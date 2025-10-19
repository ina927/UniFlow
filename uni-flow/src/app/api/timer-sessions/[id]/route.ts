import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

type Context = { params?: Record<string, string> };

export async function GET(req: NextRequest, ctx: unknown) {
  const { params } = (ctx as Context) ?? {};
  const id = params?.id;

  try {
    const session = await prisma.timerSession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Error fetching timer session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch timer session" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, ctx: unknown) {
  const { params } = (ctx as Context) ?? {};
  const id = params?.id;

  try {
    const body = await req.json();
    const updated = await prisma.timerSession.update({
      where: { id },
      data: {
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        todoId: body.todoId,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("Error updating timer session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update timer session" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, ctx: unknown) {
  const { params } = (ctx as Context) ?? {};
  const id = params?.id;

  try {
    const session = await prisma.timerSession.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error("Error deleting timer session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete timer session" },
      { status: 500 }
    );
  }
}
