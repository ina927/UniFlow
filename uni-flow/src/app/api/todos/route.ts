import { ToDo } from "@/shared/models/ToDo";
import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/shared/lib/"
import { ToDoStatus } from "@/entities/enums/ToDoStatus";

export async function POST(request: { json: () => PromiseLike<{ newToDo: any; }> | { newToDo: any; }; }){
    try {
        const {newToDo} = await request.json()
        const {userId, subjectId, assessmentId, title, content, startDate, endDate, taskStatus} = newToDo
        const savedToDo = await prisma.toDo.create({
            data: {
                userId: userId, 
                subjectId: subjectId, 
                assessmentId: assessmentId, 
                title: title, 
                description: content, 
                startDate: startDate, 
                endDate: endDate, 
                status: taskStatus}
        })
        // await savedToDo.save()
        return NextResponse.json(savedToDo, {status: 201})
    } catch (error){
        console.log(error)
        return NextResponse.json(error, {status: 500})
    }
}

export async function GET(req: NextRequest) {
    try {
        const userId = req.headers.get("userId");

        const toDos = await prisma.toDo.findMany(); //{where:{userId: {not: null}}}

        return NextResponse.json(toDos, {status: 200})
    } catch (error){
        console.log(error)
        return NextResponse.json(error, {status: 500})
    }
}