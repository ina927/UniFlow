import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "dev-secret";

export type Claims = { sub: string; email: string };

export function sign(c: Claims) {
  return jwt.sign(c, SECRET, { expiresIn: "7d" });
}
export function verify(token: string): Claims | null {
  try { return jwt.verify(token, SECRET) as Claims; } catch { return null; }
}
