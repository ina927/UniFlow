import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "../../../_helpers";
import { Role, UserStatus } from "@/entities";

type RouteContext<T extends Record<string, string | string[] | undefined>> = {
  params: Promise<T>;
};

const DEFAULT_RESET_PASSWORD = "password";

export async function POST(
  req: NextRequest,
  { params }: RouteContext<{ id: string }>
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;
  const { requester } = auth;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "missing user id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === Role.ADMIN) {
    return NextResponse.json({ error: "Cannot reset admin accounts" }, { status: 403 });
  }

  const tempPassword = DEFAULT_RESET_PASSWORD;
  const hash = await bcrypt.hash(tempPassword, 10);

  await prisma.timerSession.deleteMany({ where: { userId: id } });
  await prisma.toDo.deleteMany({ where: { userId: id } });

  const resetUser = await prisma.user.update({
    where: { id },
    data: {
      name: user.email,
      role: Role.STUDENT,
      status: UserStatus.ACTIVE,
      dob: null,
      hash,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      hash: true,
      dob: true,
      updatedAt: true,
      createdAt: true,
      version: true,
    },
  });

  const audit = await prisma.auditLog.create({
    data: {
      actor: requester.actorLabel,
      action: "USER_RESET",
      details: `Account reset to default state for ${resetUser.email}`,
      targetemail: resetUser.email,
      statusafter: resetUser.status,
    },
  });

  return NextResponse.json({
    user: resetUser,
    tempPassword,
    audit,
  });
}
