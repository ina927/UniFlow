import { ToDo } from "@/shared/models/ToDo";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma"
import { ToDoStatus } from "@/entities/enums/ToDoStatus";


export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const params = await context.params;
        const id = params.id;
        const update = await request.json();

        const newStatus: ToDoStatus | undefined =
        update.status && ToDoStatus[update.status as keyof typeof ToDoStatus];

        const newTitle: string | undefined = update.title 
        
        const newContent: string | undefined = update.description

        const newDue: Date | undefined = update.endDate

        const newStart: Date | undefined = update.startDate

        const newSubId: string | undefined = update.subjectId

        const updatedToDo = await prisma.toDo.updateMany({
            where: {id},
            data : {
                ...(newStatus && {status: newStatus}),
                ...(newTitle && {title: newTitle}),
                ...(newContent && {description: newContent}),
                ...(newDue && {endDate: newDue}),
                ...(newStart && {startDate: newStart}),
                ...(newSubId && {subjectId: newSubId})
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

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
    const params = await context.params;
    const id = params.id;
    //const update = await request.json();

    if (id){

    const selectedToDo = await prisma.toDo.deleteMany({
        where: {id}
    });

    return NextResponse.json(selectedToDo, {status: 200})}
    } catch (e: any){
        console.log("Error in", e)
        return NextResponse.json(e, {status: 500})
    }
}