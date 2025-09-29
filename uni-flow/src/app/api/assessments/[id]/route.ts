import { getAssessment, updateAssessment, deleteAssessment } from "@/entities/assessments/services";
import { deleteSuccess, getSuccess, updateSuccess, controller } from "@/shared";
import { ApiParams } from "@/shared/api";

export const GET = controller(async (_: Request, { params }: ApiParams) => {
    const data = await getAssessment((await params).id);
    return getSuccess(data, "Assessment");
});

export const PATCH = controller(async (req: Request, { params }: ApiParams) => {
    const dto = await req.json();
    const data = await updateAssessment({ id: (await params).id, dto });
    return updateSuccess(data, "Assessment");
});

export const DELETE = controller(async (_: Request, { params }: ApiParams) => {
    const data = await deleteAssessment((await params).id);
    return deleteSuccess(data.id, "Assessment");
});
