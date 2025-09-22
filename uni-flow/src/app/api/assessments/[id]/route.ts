import { getAssessment, updateAssessment, deleteAssessment } from "@/entities/assessments/services";
import { deleteSuccess, getSuccess, updateSuccess } from "@/shared";

export async function GET(_: Request, { params }: { params: { id: string } }) {
    const data = await getAssessment(params.id);
    return getSuccess(data, "Assessment");
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const dto = await req.json();
    const data = await updateAssessment({ id: params.id, dto });
    return updateSuccess(data, "Assessment");
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    const data = await deleteAssessment(params.id);
    return deleteSuccess(data.id, "Assessment");
}