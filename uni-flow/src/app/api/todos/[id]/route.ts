import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/shared/lib/"
import { ToDoStatus } from "@/entities/enums/ToDoStatus";


export async function PUT(request: NextRequest, context: { params: { id: string } }) {
    try {
        const {params} = context;
        const id = params.id;
        const update = await request.json();

        const newStatus: ToDoStatus | undefined =
        update.status && ToDoStatus[update.status as keyof typeof ToDoStatus];

        const updatedToDo = await prisma.toDo.update({
            where: {id},
            data : {
                ...(newStatus && {status: newStatus})
            }
    })
    return NextResponse.json(updatedToDo, {status: 200})
} catch (e: any){
        console.log("Error in", e);
        return NextResponse.json(
            { error: e.message ?? "Internal Server Error" },
            { status: 500 }
          );
    }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
    try {
    const {params} = context;
    const id = params.id;
    // const update = await request.json();

    const selectedToDo = await prisma.toDo.deleteMany({
        where: {id}
    });

    return NextResponse.json(selectedToDo, {status: 200})
    } catch (e: any){
        console.log("Error in", e)
        return NextResponse.json(e, {status: 500})
    }
}