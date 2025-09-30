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

interface CreateUserParams {
  email: string;
  password: string;
  name?: string;
}

export async function createUser({ email, password, name }: CreateUserParams): Promise<PublicUser> {
  // Input validation
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email address');
  }
  
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name?.trim();

  return await prisma.$transaction(async (tx) => {
    // Check for existing user within transaction
    const existing = await tx.user.findUnique({ 
      where: { email: normalizedEmail } 
    });
    
    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hash = await bcrypt.hash(password, 12);
    
    // Create user and audit log in a single transaction
    const created = await tx.user.create({
      data: {
        email: normalizedEmail,
        name: normalizedName || "Unknown", // Use undefined instead of null for optional fields
        hash,
        status: 'ACTIVE' as UserStatus,
        role: 'USER' as Role,
      },
    });

    // Create audit log entry
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tx as any).auditLog.create({
      data: {
        actor: 'System',
        action: 'USER_CREATED',
        details: `Account created for ${normalizedName || 'user'} (${normalizedEmail})`,
        userId: created.id,
      },
    });

    return toPublicUser(created);
  });
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
