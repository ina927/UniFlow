'use client';

import { AcademicCourseEntity } from '@/entities/academics';
import { Role } from '@/entities/users/enums';
import { useAuthStore } from '@/shared/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: Role;
  dob?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null); // "ok: ..." | "error: ..."
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [courses, setCourses] = useState<AcademicCourseEntity[]>([]);
  const [coursesMsg, setCoursesMsg] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const { setUserId } = useAuthStore();

  // Prefill from /api/user/me, redirect to login on 401
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (res.status === 401) {
          // session expired / not logged in
          router.replace('/?reason=auth');
          return;
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setName(data.user.name || '');
          setEmailInput(data.user.email || '');
          setDobInput(data.user.dob ? data.user.dob.slice(0, 10) : '');
        } else {
          setUser(null);
        }
      } catch {
        setMsg('error: failed to load user');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  useEffect(() => {
    const fetchCourses = async (userId: string) => {
      try {
        setCoursesMsg(null);
        const res = await fetch('/api/academic-courses', {
          headers: { 'user-id': userId },
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          setCoursesMsg(payload?.error || 'Failed to load academic course');
          return;
        }
        const data = await res.json();
        const list =
          (data?.data?.data as AcademicCourseEntity[] | undefined) ?? [];
        setCourses(list);
      } catch (error) {
        setCoursesMsg('Failed to load academic course');
      }
    };

    if (user?.id) {
      fetchCourses(user.id);
    } else {
      setCourses([]);
    }
  }, [user?.id]);

  // Save profile; on 401, redirect back to login
  async function save() {
    if (!editing) return;
    setMsg(null);

    const normalizedEmail = emailInput.trim();
    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      setMsg('error: Please provide a valid email address');
      return;
    }

    if ((pwd || confirmPwd) && pwd !== confirmPwd) {
      setMsg('error: Passwords must match');
      return;
    }

    if (dobInput) {
      const parsed = new Date(dobInput);
      if (Number.isNaN(parsed.getTime())) {
        setMsg('error: Please provide a valid date of birth');
        return;
      }
    }

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: normalizedEmail,
          dob: dobInput ? dobInput : null,
          password: pwd ? pwd : undefined,
        }),
      });

      if (res.status === 401) {
        router.replace('/?reason=auth');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setMsg(`error: ${data?.error || 'Update failed'}`);
        return;
      }

      const updatedUser = data.user as User | undefined;
      if (updatedUser) {
        setUser(updatedUser);
        setName(updatedUser.name || '');
        setEmailInput(updatedUser.email);
        setDobInput(updatedUser.dob ? updatedUser.dob.slice(0, 10) : '');
      }

      setMsg('ok: Profile updated');
      setPwd('');
      setConfirmPwd('');
      setEditing(false);
    } catch {
      setMsg('error: network error');
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUserId('');
    router.push('/');
  }

  if (loading) return <div className='profile-wrap'>Loading…</div>;

  const beginEditing = () => {
    setEditing(true);
    setMsg(null);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      nameInputRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const cancelEditing = () => {
    setEditing(false);
    setMsg(null);
    setName(user?.name || '');
    setEmailInput(user?.email || '');
    setDobInput(user?.dob ? user.dob.slice(0, 10) : '');
    setPwd('');
    setConfirmPwd('');
  };

  const displayDob = user?.dob
    ? new Date(user.dob).toLocaleDateString()
    : 'Not provided';

  return (
    <main className='profile-wrap'>
      <div className='profile-grid'>
        <section className='profile-card'>
          <h2 className='profile-title'>
            Welcome{user?.name ? `, ${user.name}` : ''} 👋
          </h2>
          <p className='profile-sub'>
            Signed in as <b>{user?.email}</b>
          </p>

          <div className='profile-actions'>
            <button
              className='pill-btn pill-primary'
              onClick={beginEditing}
              disabled={editing}
            >
              {editing ? 'Editing…' : 'Edit Profile'}
            </button>
            {user?.role === Role.ADMIN && (
              <button
                className='pill-btn pill-secondary'
                onClick={() => router.push('/admin')}
              >
                Admin Dashboard
              </button>
            )}
            <button
              className='pill-btn pill-secondary'
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </section>

        <section
          className='profile-card'
          ref={formRef}
        >
          <h2 className='profile-title'>Profile Details</h2>
          <p className='profile-sub'>Update your personal information.</p>

          {msg && (
            <div
              className={`profile-msg ${
                msg.startsWith('ok:') ? 'success' : 'error'
              }`}
            >
              {msg.replace(/^(ok:|error:)\s?/, '')}
            </div>
          )}

          <div className='profile-form'>
            {editing ? (
              <>
                <label>
                  <span>Name</span>
                  <input
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Your name'
                  />
                </label>

                <label>
                  <span>Email</span>
                  <input
                    type='email'
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder='you@example.com'
                  />
                </label>

                <label>
                  <span>Date of Birth</span>
                  <input
                    type='date'
                    value={dobInput}
                    onChange={(e) => setDobInput(e.target.value)}
                    placeholder='YYYY-MM-DD'
                  />
                </label>

                <label>
                  <span>New Password (optional)</span>
                  <input
                    type='password'
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder='Set a new password'
                  />
                </label>
                <label>
                  <span>Confirm Password</span>
                  <input
                    type='password'
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder='Re-enter new password'
                  />
                </label>

                <div className='profile-actions'>
                  <button
                    className='pill-btn pill-primary'
                    onClick={save}
                  >
                    Save changes
                  </button>
                  <button
                    className='pill-btn pill-secondary'
                    type='button'
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div className='profile-summary'>
                <p className='profile-detail'>
                  <strong>Name:</strong> {user?.name || '—'}
                </p>
                <p className='profile-detail'>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p className='profile-detail'>
                  <strong>Date of Birth:</strong> {displayDob}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className='profile-card'>
          <h2 className='profile-title'>Academic Course</h2>
          <p className='profile-sub'>Overview of your current course.</p>

          {coursesMsg && <p className='profile-msg error'>{coursesMsg}</p>}

          {courses.length === 0 && !coursesMsg && (
            <p className='profile-empty'>No academic course on file yet.</p>
          )}

          {courses.length > 0 && (
            <ul className='profile-course-list'>
              {courses.map((course) => (
                <li
                  key={course.id}
                  className='profile-course-item'
                >
                  <p className='profile-detail'>
                    <strong>Degree:</strong> {course.degree}
                  </p>
                  <p className='profile-detail'>
                    <strong>Total Credits:</strong> {course.credits}
                  </p>
                  <p className='profile-detail'>
                    <strong>Created:</strong>{' '}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                  <p className='profile-detail'>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(course.updatedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
