'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Label, Input, Button } from '@/shared/ui';
import { useAcademicStore, useAuthStore } from '@/shared/stores';
import styles from './page.module.css';
import { Role } from '@/entities/users/enums';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [dob, setDob] = useState('');
  const [degree, setDegree] = useState('');
  const [credits, setCredits] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { setUserId } = useAuthStore();
  const { setAcademicCourseId } = useAcademicStore();

  async function signUp() {
    setMsg(null);

    if (!email || !pwd) return setMsg('Email and password are required.');
    if (pwd !== confirmPwd) return setMsg('Passwords must match.');

    const trimmedDegree = degree.trim();
    if (!trimmedDegree) return setMsg('Degree is required.');

    const creditNumber = Number(credits);
    if (!Number.isFinite(creditNumber) || creditNumber <= 0) {
      return setMsg('Total credits must be a positive number.');
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pwd, dob }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMsg(data?.error || 'Sign up failed');
        return;
      }

      const createdUser = data?.data?.data;
      if (!createdUser?.id) {
        setMsg('Unable to create course for new user.');
        return;
      }

      const courseRes = await fetch('/api/academic-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': createdUser.id,
        },
        body: JSON.stringify({ degree: trimmedDegree, credits: creditNumber }),
      });

      if (!courseRes.ok) {
        const courseData = await courseRes.json().catch(() => null);
        setMsg(courseData?.error || 'Failed to save academic details.');
        return;
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pwd }),
      });
  
      const raw = await response.text();
      let signInData: unknown = null;
      if (raw) {
        try {
          signInData = JSON.parse(raw);
        } catch (err) {
          console.warn('login response not JSON', err);
        }
      }
  
      const payload =
        signInData && typeof signInData === 'object' ? (signInData as { error?: string }) : null;
      if (!response.ok) {
        const message = payload?.error || raw || `Sign in failed (${res.status})`;
        setMsg(message);
        return;
      }
  
      const userData = (signInData as {
        user?: { id: string; role?: Role };
      })?.user;
  
      if (!userData?.id) {
        setMsg('Unexpected response from server.');
        return;
      }
      
      setUserId(createdUser.id);
      const courseId = (await courseRes.json())?.data?.data?.id;
      setAcademicCourseId(courseId);
      
      if (userData.role === Role.ADMIN) {
        router.push('/admin');
        return;
      }
      
      router.push('/academic');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.wrap}>
      <section className={styles.card}>
        <h1 className="text-title1-bold text-center mb-2">Create account</h1>
        <p className={styles.sub}>
          Already have an account?{' '}
          <Link href="/" className={styles.link}>Log in</Link>
        </p>

        <form
          className={styles.form}
          onSubmit={(e) => { e.preventDefault(); void signUp(); }}
        >
          {/* User details */}
          <div className={styles.grid}>
            <div className={styles.formItem}>
              <Label className={styles.label}>
                Name <span className={styles.required}>*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="h-10"
              />
            </div>

            <div className={styles.formItem}>
              <Label className={styles.label}>
                Email <span className={styles.required}>*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="someone@mail.com"
                className="h-10"
              />
            </div>

            <div className={styles.formItem}>
              <Label className={styles.label}>
                Password <span className={styles.required}>*</span>
              </Label>
              <Input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-10"
              />
            </div>

            <div className={styles.formItem}>
              <Label className={styles.label}>
                Confirm Password <span className={styles.required}>*</span>
              </Label>
              <Input
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                placeholder="Re-enter your password"
                className="h-10"
              />
            </div>

            <div className={styles.formItem}>
              <Label className={styles.label}>Date of Birth</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-10"
              />
            </div>
          </div>

          {/* Divider */}
          <hr className={styles.divider} />

          {/* Academic details */}
          <h2 className="text-title3-bold mb-2">Academic details</h2>

          <div className={styles.grid}>
            <div className={styles.formItem}>
              <Label className={styles.label}>
                Degree <span className={styles.required}>*</span>
              </Label>
              <Input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. Bachelor of Information Technology"
                className="h-10"
              />
            </div>

            <div className={styles.formItem}>
              <Label className={styles.label}>
                Total Credits <span className={styles.required}>*</span>
              </Label>
              <Input
                type="number"
                min={1}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="e.g. 144"
                className="h-10"
              />
            </div>
          </div>

          {msg && <p className={styles.error}>{msg}</p>}

          <Button
            type="submit"
            className="mt-4 h-10"
            disabled={loading}
          >
            {loading ? 'Signing up…' : 'Sign up'}
          </Button>
        </form>
      </section>
    </main>
  );
}