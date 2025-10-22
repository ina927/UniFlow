'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Label, Button, Input } from '@/shared/ui';
import Image from 'next/image';

import { LOGO } from '@/shared/consts/images';
import { Role } from '@/entities/users/enums';
import { useAuthStore } from '@/shared/stores';
import styles from './page.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const { setUserId } = useAuthStore();

  async function signIn() {
    setMsg(null);
    if (!email || !pwd) {
      setMsg('email & password required');
      return;
    }

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
      setMsg(message);
      return;
    }

    const userData = (data as {
      user?: { id: string; role?: Role };
    })?.user;

    if (!userData?.id) {
      setMsg('Unexpected response from server.');
      return;
    }

    setUserId(userData.id);

    if (userData.role === Role.ADMIN) {
      router.push('/admin');
      return;
    }

    router.push('/academic'); // match post-signup redirect for students
  }

  return (
      <main className={styles.wrap}>
      <section className={styles.card}>
        <div className="flex justify-center">
            <Image
              src={LOGO.src}
              alt={LOGO.alt}
              width={150}
              height={80}
              priority
            />
        </div>
        <h1 className="text-title1-bold text-secondary text-center mb-8">Log in to your account</h1>
        <form
          className={styles.form}
          onSubmit={(e) => { e.preventDefault(); void signIn(); }}
        >
          <div className={styles.formItem}>
            <Label className={styles.label}>Email</Label>
            <Input
              type="email"
              placeholder="Enter your email (e.g. someone@mail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='h-10'
            />
          </div>

          <div className={styles.formItem}>
            <Label className={styles.label}>Password</Label>
            <Input
              type="password"
              placeholder="Enter your password (min. 8 characters)"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className='h-10'
            />
          </div>

          {msg && <p className={styles.error}>{msg}</p>}
          <p className={styles.sub}>
            Don’t have an account? {'  '}
            <Link href="/register" className={styles.link}> Sign up</Link>
          </p>
          <Button type="submit" className="mt-2 h-10">
            Log in
          </Button>
        </form>
      </section>
    </main>
  );
}