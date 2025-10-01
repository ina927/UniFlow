import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { Role, UserStatus } from "@/shared/generated/prisma";

export type PublicUser = {
  id: string;
  email: string;
  name?: string;
  role?: Role;
  status?: UserStatus;
};

type PrismaUserSnapshot = {
  id: string;
  email: string;
  name: string | null;
  role?: Role;
  status?: UserStatus;
};

const toPublicUser = (user: PrismaUserSnapshot): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name ?? undefined,
  role: user.role,
  status: user.status,
});

export async function createUser(email: string, password: string, name?: string): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 10);
  const normalizedName = name?.trim();
  const created = await prisma.user.create({
    data: {
      email,
      name: normalizedName && normalizedName.length > 0 ? normalizedName : email,
      hash,
    },
  });

  await prisma.auditLog.create({
    data: {
      actor: "System",
      action: "USER_CREATED",
      details: normalizedName
        ? `Account created for ${normalizedName} (${created.email})`
        : `Account created for ${created.email}`,
      targetemail: created.email,
    },
  });

  return toPublicUser(created);
}

export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.hash);
  return isValid ? toPublicUser(user) : null;
}

export async function getByEmail(email: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  return user ? toPublicUser(user) : null;
}

export async function updateUser(
  email: string,
  data: { name?: string; password?: string }
): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const updates: { name?: string; hash?: string } = {};
  if (typeof data.name === "string") {
    const trimmed = data.name.trim();
    if (trimmed.length === 0) {
      updates.name = user.email;
    } else {
      updates.name = trimmed;
    }
  }
  if (typeof data.password === "string") updates.hash = await bcrypt.hash(data.password, 10);

  if (Object.keys(updates).length === 0) return toPublicUser(user);

  const updated = await prisma.user.update({ where: { email }, data: updates });
  return toPublicUser(updated);
}
