import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/app/lib/jwt";
import { prisma } from "@/shared/lib/prisma";
import { Role } from "@/entities";

export type AdminRequester = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  actorLabel: string;
};

export async function requireAdmin(
  req: NextRequest
): Promise<{ ok: true; requester: AdminRequester } | { ok: false; response: NextResponse }> {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }

  const claims = verify(token);
  if (!claims?.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }

  const requester = await prisma.user.findUnique({
    where: { email: claims.email },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!requester || requester.role !== Role.ADMIN) {
    return {
      ok: false,
      response: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }

  const actorLabel = requester.name?.trim().length ? requester.name : requester.email;

  return {
    ok: true,
    requester: {
      ...requester,
      actorLabel,
    },
  };
}
