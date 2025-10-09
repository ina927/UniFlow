import bcrypt from "bcryptjs";
import { prisma } from "@/shared/lib/prisma";
import { Role, UserStatus } from "@/shared/generated/prisma";

export type PublicUser = {
  id: string;
  email: string;
  name?: string;
  role?: Role;
  status?: UserStatus;
  dob?: string;
};

type PrismaUserSnapshot = {
  id: string;
  email: string;
  name: string | null;
  dob: Date | null;
  role?: Role;
  status?: UserStatus;
};

const toPublicUser = (user: PrismaUserSnapshot): PublicUser => ({
  id: user.id,
  email: user.email,
  name: user.name ?? undefined,
  role: user.role,
  status: user.status,
  dob: user.dob ? user.dob.toISOString() : undefined,
});

export async function createUser(email: string, password: string, name?: string, dob?: string): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hash = await bcrypt.hash(password, 10);
  const normalizedName = name?.trim();
  let dobValue: Date | null = null;
  if (dob) {
    const parsed = new Date(dob);
    if (!Number.isNaN(parsed.getTime())) {
      dobValue = parsed;
    }
  }
  const created = await prisma.user.create({
    data: {
      email,
      name: normalizedName && normalizedName.length > 0 ? normalizedName : email,
      hash,
      dob: dobValue,
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

type UpdateUserInput = {
  name?: string;
  password?: string;
  email?: string;
  dob?: string | null;
};

export async function updateUser(
  currentEmail: string,
  data: UpdateUserInput
): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { email: currentEmail } });
  if (!user) return null;

  const updates: {
    name?: string;
    hash?: string;
    email?: string;
    dob?: Date | null;
  } = {};

  if (typeof data.email === "string") {
    const normalizedEmail = data.email.trim();
    if (normalizedEmail.length === 0) {
      throw new Error("Email cannot be empty");
    }
    if (normalizedEmail !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (existing) {
        throw new Error("Email already registered");
      }
      updates.email = normalizedEmail;
    }
  }

  if (typeof data.name === "string") {
    const trimmed = data.name.trim();
    updates.name =
      trimmed.length === 0 ? (updates.email ?? user.email) : trimmed;
  }

  if (typeof data.password === "string" && data.password.length > 0) {
    updates.hash = await bcrypt.hash(data.password, 10);
  }

  if (data.dob !== undefined) {
    const dobInput = data.dob;
    if (!dobInput) {
      updates.dob = null;
    } else {
      const parsed = new Date(dobInput);
      if (Number.isNaN(parsed.getTime())) {
        throw new Error("Invalid date of birth");
      }
      updates.dob = parsed;
    }
  }

  if (Object.keys(updates).length === 0) {
    return toPublicUser(user);
  }

  const updated = await prisma.user.update({ where: { email: currentEmail }, data: updates });
  return toPublicUser(updated);
}
