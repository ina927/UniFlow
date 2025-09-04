import { connectDB } from "@/shared";
import { ToDo } from "@/shared";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: { json: () => PromiseLike<{ newToDo: any; }> | { newToDo: any; }; }){
    try {
        await connectDB()
        const {newToDo} = await request.json()
        const {userId, subjectId, assessmentId, title, content, startDate, endDate, taskStatus} = newToDo
        const savedToDo = new ToDo({userId, subjectId, assessmentId, title, content, startDate, endDate, taskStatus})
        await savedToDo.save()
        return NextResponse.json(newToDo, {status: 201})
    } catch (error){
        console.log(error)
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const userId = req.headers.get("userId");

        const toDos = await ToDo.find({userId: userId});

        return NextResponse.json(toDos, {status: 200})
    } catch (error){
        console.log(error)
    }
}