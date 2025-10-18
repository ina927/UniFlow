/* @vitest-environment node */
import { POST as loginHandler } from '@/app/api/auth/login/route';
import { describe, expect, it, vi } from 'vitest';

import { NextRequest } from 'next/server';

// Mock jwt.sign to avoid real crypto
vi.mock('@/entities/auth/jwt', () => ({
  sign: vi.fn(() => 'FAKE.JWT.TOKEN'),
}));

// Mock the auth service verifyUser used by the route
vi.mock('@/entities/auth/users', () => ({
  verifyUser: vi.fn(async (email: string, pw: string) => {
    if (email === 'test@uni.com' && pw === 'Secret123') {
      return { id: 'u1', email };
    }
    return null;
  }),
}));

function req(body: any) {
  // Build a base Request, then wrap it in NextRequest so the type matches the handler signature
  const base = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return new NextRequest(base);
}

describe('POST /api/auth/login', () => {
  it('200 + sets cookie when credentials are valid', async () => {
    const res = await loginHandler(
      req({ email: 'test@uni.com', password: 'Secret123' })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.user.email).toBe('test@uni.com');
    // Cookie header exists
    const cookies = res.headers.get('set-cookie') || '';
    expect(cookies).toContain('token=');
  });

  it('401 on invalid credentials', async () => {
    const res = await loginHandler(req({ email: 'x@x.com', password: 'nope' }));
    expect(res.status).toBe(401);
  });

  it('400 when missing fields', async () => {
    const res = await loginHandler(req({}));
    expect(res.status).toBe(400);
  });
});
