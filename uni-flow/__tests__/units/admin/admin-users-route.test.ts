/* @vitest-environment node */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH as patchUser } from "@/app/api/admin/users/[id]/route";
import { Role, UserStatus } from "@/shared/generated/prisma/client";
import { NextRequest } from "next/server";

// stub CSS modules so PostCSS/Tailwind aren't invoked during SSR tests
vi.mock("@/shared/ui/table.module.css", () => ({}));
vi.mock("@/shared/ui/toggle-group.module.css", () => ({}));

type TestRouteContext = { params: { id: string } };
type PatchCtx = Parameters<typeof patchUser>[1];

// In-memory user table for prisma mocking
const table = new Map<string, any>();

vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(async ({ where, data }: any) => {
        const rec = table.get(where.id);
        if (!rec) throw new Error("not found");
        const next = { ...rec, ...data };
        table.set(where.id, next);
        return next;
      }),

      findUnique: vi.fn(async ({ where }: any) => {
        if (where?.id) return table.get(where.id) || null;
        if (where?.email) {
          for (const rec of table.values()) {
            if (rec.email === where.email) return rec;
          }
        }
        return null;
      }),
      
    },
    
    auditLog: {
        create: vi.fn(async (args: any) => ({
            id: "al1",
            actor: args.data.actor || "System",
            action: args.data.action || "UPDATE_USER",
            details: args.data.details,
            targetemail: args.data.targetemail,
            statusafter: args.data.statusafter,
        })),
    },
    
  },
}));

// Mock JWT verify used in requireAdmin()
vi.mock("@/entities/auth/jwt", () => ({
  verify: vi.fn((token: string) => {
    if (token === "ADMIN_TOKEN") {
      return { sub: "admin1", email: "admin@uni.com", role: Role.ADMIN };
    }
    if (token === "USER_TOKEN") {
      return { sub: "user1", email: "u@uni.com", role: Role.STUDENT };
    }
    throw new Error("bad token");
  }),
}));

function makeReq(body: any, cookie?: string) {
  const base = new Request("http://localhost/api/admin/users/123", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  return new NextRequest(base);
}

beforeEach(() => {
  table.clear();
  table.set("123", { 
    id: "123", 
    email: "target@uni.com", 
    role: Role.STUDENT, 
    status: UserStatus.ACTIVE });

  table.set("admin1", {
    id: "admin1",
    email: "admin@uni.com",
    role: Role.ADMIN,
    status: UserStatus.ACTIVE
  });
});

describe("PATCH /api/admin/users/[id] (F102)", () => {
  it("401 when no token cookie present", async () => {
    // No cookie → requireAdmin should reject
    const res = await patchUser(
      makeReq({ role: Role.ADMIN }),
      { params: { id: "123" } } as TestRouteContext as unknown as PatchCtx
    );
    expect(res.status).toBe(401);
  });

  it("403 when STUDENT token attempts admin route", async () => {
    const res = await patchUser(
      makeReq({ role: Role.ADMIN }, "token=USER_TOKEN"),
      { params: { id: "123" } } as TestRouteContext as unknown as PatchCtx
    );
    expect(res.status).toBe(403);
  });

  it("200 when ADMIN updates user role/status", async () => {
    const res = await patchUser(
      makeReq({ role: Role.ADMIN, status: UserStatus.SUSPENDED }, "token=ADMIN_TOKEN"),
      { params: { id: "123" } } as TestRouteContext as unknown as PatchCtx
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.user.role).toBe(Role.ADMIN);
    expect(json.user.status).toBe(UserStatus.SUSPENDED);
    // optional extras to look pro:
    expect(json.audit).toBeTruthy();
    // if you want to be precise about the log message:
    expect(typeof json.audit.details).toBe("string");
    expect(json.audit.targetemail).toBe("target@uni.com");
    expect(json.audit.statusafter).toBe(UserStatus.SUSPENDED);
  });
});