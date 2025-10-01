import { NextRequest } from "next/server";

import { controller } from "@/shared/api";
import { UpdateTermDto } from "@/entities";
import { deleteTerm, getTerm, updateTerm } from "@/entities/academics/services";
import { deleteSuccess, getSuccess, missingError, updateSuccess } from "@/shared";

export const GET = controller(async (req: NextRequest) => {
    const userId: string = req.headers.get('user-id') as string;

    if (!userId) {
      return missingError("User ID");
    }
    
    const termId = req.nextUrl.href.split('/').pop();

    if (!termId) {
      return missingError("Term ID");
    }

    const term = await getTerm({ id: termId });
    
    return getSuccess(term, "Term");
});

export const PATCH = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const termId = req.nextUrl.href.split('/').pop();

  if (!termId) {
    return missingError("Term ID");
  }

  const body: UpdateTermDto = await req.json();
  const term = await updateTerm({ id: termId, dto: body });

  return updateSuccess(term, "Term");
});

export const DELETE = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }
  
  const termId = req.nextUrl.href.split('/').pop();

  if (!termId) {
    return missingError("Term ID");
  }

  const deletedTermId = await deleteTerm({ id: termId });  

  return deleteSuccess(deletedTermId.data, "Term");
});
