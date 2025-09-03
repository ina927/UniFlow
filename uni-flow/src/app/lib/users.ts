import bcrypt from "bcryptjs";

export type PublicUser = { id: string; email: string; name?: string };
type User = PublicUser & { passwordHash: string };

const users = new Map<string, User>(); // email -> user

export async function createUser(email: string, password: string, name?: string): Promise<PublicUser> {
  if (users.has(email)) throw new Error("Email already registered");
  const u: User = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordHash: await bcrypt.hash(password, 10),
  };
  users.set(email, u);
  return { id: u.id, email: u.email, name: u.name };
}

export async function verifyUser(email: string, password: string): Promise<PublicUser | null> {
  const u = users.get(email);
  if (!u) return null;
  return (await bcrypt.compare(password, u.passwordHash)) ? { id: u.id, email: u.email, name: u.name } : null;
}

export function getByEmail(email: string): PublicUser | null {
  const u = users.get(email);
  return u ? { id: u.id, email: u.email, name: u.name } : null;
}

export async function updateUser(email: string, data: { name?: string; password?: string }): Promise<PublicUser | null> {
  const u = users.get(email);
  if (!u) return null;
  if (typeof data.name === "string") u.name = data.name;
  if (typeof data.password === "string") u.passwordHash = await bcrypt.hash(data.password, 10);
  users.set(email, u);
  return { id: u.id, email: u.email, name: u.name };
}