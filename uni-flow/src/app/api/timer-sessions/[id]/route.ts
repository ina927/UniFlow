import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";

// GET /api/timer-sessions/[id]
export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    try {
        const session = await prisma.timerSession.findUnique({
            where: { id },
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, session });
    } catch (error) {
        console.error("Error fetching timer session:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch timer session" }, { status: 500 });
    }
}

// PUT /api/timer-sessions/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

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
        return NextResponse.json({ success: false, error: "Failed to update timer session" }, { status: 500 });
    }
}

// DELETE /api/timer-sessions/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;

    try {
        const session = await prisma.timerSession.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, session });
    } catch (error) {
        console.error("Error deleting timer session:", error);
        return NextResponse.json({ success: false, error: "Failed to delete timer session" }, { status: 500 });
    }
}
