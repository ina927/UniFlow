import { describe, it, expect, vi, beforeEach } from "vitest";

// SUT
import * as Users from "@/entities/auth/users";

// Mock prisma module used inside users.ts
const store = new Map<string, any>();
vi.mock("@/shared/lib/prisma", () => ({
    prisma: {
      user: {
        findUnique: vi.fn(async ({ where }: any) => {
          for (const v of store.values()) if (v.email === where.email) return v;
          return null;
        }),
        create: vi.fn(async ({ data }: any) => {
          const id = String(store.size + 1);
          const rec = { id, ...data, dob: data.dob ? new Date(data.dob) : null };
          store.set(id, rec);
          return rec;
        }),
        update: vi.fn(async ({ where, data }: any) => {
          const rec = store.get(where.id);
          if (!rec) throw new Error("not found");
          const updated = { ...rec, ...data };
          store.set(where.id, updated);
          return updated;
        }),
      },
      auditLog: {
        create: vi.fn(async (_args: any) => ({ id: "al1" })),
      },
    },
  }));

// Mock bcrypt used by verifyUser/createUser
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(async (pw: string) => `HASHED:${pw}`),
    compare: vi.fn(async (pw: string, hashed: string) => hashed === `HASHED:${pw}`),
  },
}));

beforeEach(() => {
  store.clear();
});

describe("Auth service (F101)", () => {
  it("createUser → stores hashed password; verifyUser(valid) passes", async () => {
    const u = await (Users as any).createUser("test@uni.com", "Secret123", "Michael");
    expect(u.email).toBe("test@uni.com");

    const ok = await (Users as any).verifyUser("test@uni.com", "Secret123");
    expect(ok?.email).toBe("test@uni.com");
  });

  it("verifyUser(invalid) → returns null", async () => {
    await (Users as any).createUser("test@uni.com", "Secret123");
    const bad = await (Users as any).verifyUser("test@uni.com", "nope");
    expect(bad).toBeNull();
  });
});