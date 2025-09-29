import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/prisma";
import { requireAdmin } from "@/app/api/admin/_helpers";
import { Role } from "@/entities";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const [users, audits] = await Promise.all([
      prisma.user.findMany({
        where: { role: { not: Role.ADMIN } },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          role: true,
          email: true,
          hash: true,
          dob: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          version: true,
        },
      }),
      prisma.auditLog
        .findMany({
          take: 50,
          select: {
            id: true,
            actor: true,
            action: true,
            details: true,
          },
        })
        .catch(() => []),
    ]);

    return NextResponse.json({ users, audits });
  } catch (err) {
    console.error("Failed to load admin dashboard data", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "failed_to_load_dashboard", message },
      { status: 500 }
    );
  }
}
