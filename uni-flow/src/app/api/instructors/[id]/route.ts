import { NextRequest } from "next/server";

import { controller } from "@/shared/api";
import { UpdateInstructorDto } from "@/entities";
import { deleteInstructor, getInstructor, updateInstructor } from "@/entities/academics/services";
import { deleteSuccess, getSuccess, missingError, updateSuccess } from "@/shared";

export const GET = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }
  
  const instructorId = req.nextUrl.href.split('/').pop();

  if (!instructorId) {
    return missingError("Instructor ID");
  }

  const instructor = await getInstructor({ id: instructorId });
  
  return getSuccess(instructor, "Instructor");
});

export const PATCH = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }

  const instructorId = req.nextUrl.href.split('/').pop();

  if (!instructorId) {
    return missingError("Instructor ID");
  }

  const body: UpdateInstructorDto = await req.json();
  const instructor = await updateInstructor({ id: instructorId, dto: body });

  return updateSuccess(instructor, "Instructor");
});

export const DELETE = controller(async (req: NextRequest) => {
  const userId: string = req.headers.get('user-id') as string;

  if (!userId) {
    return missingError("User ID");
  }
  
  const instructorId = req.nextUrl.href.split('/').pop();

  if (!instructorId) {
    return missingError("Instructor ID");
  }

  const deletedInstructorId = await deleteInstructor({ id: instructorId });  

  return deleteSuccess(deletedInstructorId.data, "Instructor");
});
