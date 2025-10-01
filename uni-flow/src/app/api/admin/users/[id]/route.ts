import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "../../_helpers";
import { Role, UserStatus } from "@/entities";

const allowedRoles = new Set(Object.values(Role));
const allowedStatuses = new Set(Object.values(UserStatus));

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  const { requester } = auth;
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: "missing user id" }, { status: 400 });
  }

  const body = await req.json().catch(() => null) as {
    name?: string;
    role?: Role;
    status?: UserStatus;
  } | null;

  if (!body) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.role === Role.ADMIN) {
    return NextResponse.json({ error: "Cannot modify other admins" }, { status: 403 });
  }

  const updates: { name?: string; role?: Role; status?: UserStatus } = {};
  const changed: string[] = [];

  if (typeof body.name === "string") {
    const trimmed = body.name.trim();
    updates.name = trimmed.length > 0 ? trimmed : user.email;
    changed.push("name");
  }

  if (body.role && allowedRoles.has(body.role)) {
    updates.role = body.role;
    changed.push("role");
  }

  if (body.status && allowedStatuses.has(body.status)) {
    updates.status = body.status;
    changed.push("status");
  }

  if (!changed.length) {
    return NextResponse.json({ error: "no valid fields to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: updates,
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

  let action: "USER_EDITED" | "USER_DEACTIVATED" | "USER_REACTIVATED" = "USER_EDITED";
  if (updates.status === UserStatus.INACTIVE) action = "USER_DEACTIVATED";
  if (updates.status === UserStatus.ACTIVE && user.status !== UserStatus.ACTIVE) {
    action = "USER_REACTIVATED";
  }

  const audit = await prisma.auditLog.create({
    data: {
      actor: requester.actorLabel,
      action,
      details: `Updated ${changed.join(", ")} for ${updated.email}`,
      targetemail: updated.email,
    },
  });

  return NextResponse.json({ user: updated, audit });
}
