'use client';

import { useAuthStore } from '@/shared/stores';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const { setUserId } = useAuthStore();

  async function signIn() {
    setMsg(null);
    if (!email || !pwd) return setMsg('email & password required');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pwd }),
    });

    const raw = await res.text();
    let data: unknown = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.warn('login response not JSON', err);
      }
    }

    const payload =
      data && typeof data === 'object' ? (data as { error?: string }) : null;
    if (!res.ok) {
      const message = payload?.error || raw || `Sign in failed (${res.status})`;
      return setMsg(message);
    }

    setUserId((data as { user: { id: string } })?.user?.id);

    router.push('/academic'); // match post-signup redirect
  }

  return (
    <main className='login-wrap'>
      <section className='login-card'>
        <h1 className='login-title'>Please Login</h1>

        <div className='login-form'>
          <label className='login-label'>
            <span>Email</span>
            <input
              className='login-input'
              type='email'
              placeholder='someone@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className='login-label'>
            <span>Password</span>
            <input
              className='login-input'
              type='password'
              placeholder='••••••••'
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </label>
          {msg && <p className='login-msg error'>{msg}</p>}

          <div className='login-actions'>
            <button
              type='button'
              className='pill-btn pill-secondary'
              onClick={() => router.push('/register')}
            >
              Sign Up
            </button>
            <button
              type='button'
              className='pill-btn pill-primary'
              onClick={signIn}
            >
              <span className='play'>▶</span> Sign In
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
