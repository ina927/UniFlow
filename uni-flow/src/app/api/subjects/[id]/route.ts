
import { NextRequest } from "next/server";

import { UpdateSubjectDto } from "@/entities";
import { deleteSubject, getSubject, updateSubject } from "@/entities/academics/services";
import { ApiParams, controller } from "@/shared/api";
import { deleteSuccess, getSuccess, missingError, updateSuccess } from "@/shared";

export const GET = controller(async (req: NextRequest, { params }: ApiParams) => {
    const userId = req.headers.get('user-id');

    if (!userId) {
      return missingError("User ID");
    }

    const subject = await getSubject({ id: (await params).id });

    return getSuccess(subject, "Subject");
});

export const PATCH = controller(async (req: NextRequest, { params } : ApiParams) => {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return missingError("User ID");
  }

  const body: UpdateSubjectDto = await req.json();
  const subject = await updateSubject({ id: (await params).id, dto: body });

  return updateSuccess(subject, "Subject");
});

export const DELETE = controller(async (req: NextRequest, { params }: ApiParams) => {
  const userId = req.headers.get('user-id');

  if (!userId) {
    return missingError("User ID");
  }

  const deletedSubjectId = await deleteSubject({ id: (await params).id });

  return deleteSuccess(deletedSubjectId.data, "Subject");
});
