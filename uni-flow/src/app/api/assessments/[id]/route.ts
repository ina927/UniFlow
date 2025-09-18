import { NextResponse } from "next/server";
import { getAssessment, updateAssessment, deleteAssessment } from "@/entities/assessments/services/assessment.service";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const data = await getAssessment(params.id);
    return NextResponse.json({ status: true, statusCode: 200, message: "OK", data });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const dto = await req.json();
    const data = await updateAssessment({ id: params.id, dto });
    return NextResponse.json({ status: true, statusCode: 200, message: "Updated", data });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const data = await deleteAssessment(params.id);
    return NextResponse.json({ status: true, statusCode: 200, message: "Deleted", data });
}