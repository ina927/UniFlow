'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { AcademicCourseEntity } from '@/entities/academics';
import { Role } from '@/entities/users/enums';
import { useAcademicStore, useAuthStore } from '@/shared/stores';
import { useLogout } from '@/shared/hooks/useLogout';
import { is } from 'date-fns/locale';
import { isLogin } from '@/shared/lib/isLogin';

type User = {
  id: string;
  email: string;
  name?: string;
  role?: Role;
  dob?: string;
};

export default function ProfilePage() {
  isLogin();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [dobInput, setDobInput] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [courses, setCourses] = useState<AcademicCourseEntity[]>([]);
  const [coursesMsg, setCoursesMsg] = useState<string | null>(null);
  const [courseEditing, setCourseEditing] = useState(false);
  const [courseEditingId, setCourseEditingId] = useState<string | null>(null);
  const [courseDegree, setCourseDegree] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  const [courseStatus, setCourseStatus] = useState<string>('');
  const formRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const courseSectionRef = useRef<HTMLElement | null>(null);
  const courseDegreeInputRef = useRef<HTMLInputElement | null>(null);
  const { setUserId } = useAuthStore();
  const { clear } = useAcademicStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/user/me', { cache: 'no-store' });
        if (res.status === 401) {
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
      } catch {
        setCoursesMsg('Failed to load academic course');
      }
    };

    if (user?.id) {
      fetchCourses(user.id);
    } else {
      setCourses([]);
    }
  }, [user?.id]);

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
      setTimeout(() => setMsg(null), 1500);
    } catch {
      setMsg('error: network error');
    }
  }

  const { logout } = useLogout();

  if (loading) return <div className='profile-wrap'>Loading…</div>;

  const beginEditing = () => {
    setEditing(true);
    setMsg(null);

    if (user?.role !== Role.ADMIN) {
      const targetCourse = courses[0];
      if (targetCourse) {
        setCourseEditingId(targetCourse.id);
        setCourseDegree(targetCourse.degree ?? '');
        const c = Number(targetCourse.credits);
        setCourseCredits(Number.isFinite(c) ? String(c) : '');
      } else {
        setCourseEditingId(null);
        setCourseDegree('');
        setCourseCredits('');
      }
    }

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

    if (user?.role !== Role.ADMIN) {
      const target =
        (courseEditingId && courses.find(c => c.id === courseEditingId)) || courses[0];
      const originalCredits = target ? Number(target.credits) : NaN;
      setCourseDegree(target?.degree ?? '');
      setCourseCredits(Number.isFinite(originalCredits) ? String(originalCredits) : '');
      setCourseEditingId(null);
      setCourseStatus('');
    }
  };

  const beginCourseEditing = () => {
    if (courseEditing) return;

    setCourseStatus('');

    const targetCourse = courses[0];

    if (!targetCourse) {
      setCourseStatus('error: No academic course to edit yet.');
      return;
    }

    setCourseEditing(true);
    setCourseEditingId(targetCourse.id);
    setCourseDegree(targetCourse.degree ?? '');
    const targetCredits = Number(targetCourse.credits);
    setCourseCredits(
      Number.isFinite(targetCredits) ? String(targetCredits) : ''
    );

    setTimeout(() => {
      courseSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      courseDegreeInputRef.current?.focus({ preventScroll: true });
    }, 0);
  };

  const cancelCourseEditing = () => {
    const editingId = courseEditingId;

    setCourseEditing(false);
    setCourseEditingId(null);
    setCourseStatus('');

    const original: AcademicCourseEntity | undefined =
      editingId ? courses.find((course) => course.id === editingId) : undefined;

    const originalCredits = original ? Number(original.credits) : NaN;

    setCourseDegree(original?.degree ?? '');
    setCourseCredits(
      Number.isFinite(originalCredits) ? String(originalCredits) : ''
    );
  };

  const saveCourse = async () => {
    if (!courseEditingId) return;
    if (!user?.id) {
      setCourseStatus('error: Unable to update academic course without a user session.');
      return;
    }

    setCourseStatus('');

    const normalizedDegree = courseDegree.trim();
    const parsedCredits = Number(courseCredits);

    if (!normalizedDegree) {
      setCourseStatus('error: Please provide a degree name.');
      return;
    }

    if (!Number.isFinite(parsedCredits) || parsedCredits < 0) {
      setCourseStatus('error: Total credits must be zero or greater.');
      return;
    }

    try {
      const res = await fetch(`/api/academic-courses/${courseEditingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'user-id': user.id,
        },
        body: JSON.stringify({
          degree: normalizedDegree,
          credits: parsedCredits,
        }),
      });

      if (res.status === 401) {
        router.replace('/?reason=auth');
        return;
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const errorMsg =
          payload?.error || 'Failed to update academic course.';
        setCourseStatus(`error: ${errorMsg}`);
        return;
      }

      const payload = await res.json().catch(() => null);
      const updatedCourse = (payload?.data?.data as
        | AcademicCourseEntity
        | undefined) ?? {
        id: courseEditingId,
        degree: normalizedDegree,
        credits: parsedCredits,
      };

      setCourses((prev) =>
        prev.map((course) =>
          course.id === updatedCourse.id
            ? { ...course, ...updatedCourse }
            : course
        )
      );

      setCourseDegree(normalizedDegree);
      setCourseCredits(String(parsedCredits));
      setCourseEditing(false);
      setCourseEditingId(null);
    } catch {
      setCourseStatus('error: Failed to update academic course.');
    }
  };

  const saveAll = async () => {
    await save();
    if (user?.role !== Role.ADMIN && courseEditingId) {
      await saveCourse();
    }
    setEditing(false);
  };

  const displayDob = user?.dob
    ? new Date(user.dob).toLocaleDateString()
    : 'Not provided';

  return (
    <main className='profile-wrap'>
      <div className='profile-grid'>
        <section className='profile-card' ref={formRef}>
          <h2 className='text-large-title-bold mb-4'>
            Welcome{user?.name ? `, ${user.name}` : ''} 👋
          </h2>

          <div className='profile-actions'>
            {!editing && (
              <>
                <button
                  className='pill-btn pill-primary'
                  onClick={beginEditing}
                >
                  Edit Profile
                </button>
                <button
                  className='pill-btn pill-outline'
                  onClick={() => { void logout(); }}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {msg && (
            <div
              className={`profile-msg ${
                msg.startsWith('ok:') ? 'success' : 'error'
              }`}
            >
              {msg.replace(/^(ok:|error:)\s?/, '')}
            </div>
          )}

          <div
            className='profile-form'
            style={
              editing
                ? { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12 }
                : undefined
            }
          >
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

                {user?.role !== Role.ADMIN && (
                  <>
                    <label>
                      <span>Degree</span>
                      <input
                        ref={courseDegreeInputRef}
                        value={courseDegree}
                        onChange={(e) => setCourseDegree(e.target.value)}
                        placeholder='e.g. Bachelor of IT'
                      />
                    </label>
                    <label>
                      <span>Total Credits</span>
                      <input
                        type='number'
                        min={0}
                        value={courseCredits}
                        onChange={(e) => setCourseCredits(e.target.value)}
                        placeholder='e.g. 144'
                      />
                    </label>
                    {courseStatus && (
                      <div
                        className={`profile-msg ${
                          courseStatus.startsWith('ok:') ? 'success' : 'error'
                        }`}
                        style={{ gridColumn: '1 / -1' }}
                      >
                        {courseStatus.replace(/^(ok:|error:)\s?/, '')}
                      </div>
                    )}
                  </>
                )}

                <div className='profile-actions' style={{ gridColumn: '1 / -1' }}>
                  <button
                    className='pill-btn pill-primary'
                    onClick={saveAll}
                  >
                    Save changes
                  </button>
                  <button
                    className='pill-btn pill-outline'
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

                {user?.role !== Role.ADMIN && (
                  <>
                    <hr className='profile-divider' />
                    {coursesMsg && <p className='profile-msg error'>{coursesMsg}</p>}
                    {courses.length > 0 ? (
                      <>
                        <p className='profile-detail'>
                          <strong>Degree:</strong> {courses[0].degree}
                        </p>
                        <p className='profile-detail'>
                          <strong>Total Credits:</strong> {courses[0].credits}
                        </p>
                      </>
                    ) : (
                      !coursesMsg && <p className='profile-empty'>No academic course on file yet.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {false && user?.role !== Role.ADMIN && (
          <section
            className='profile-card'
            ref={courseSectionRef}
          >
            <h2 className='profile-title'>Academic Course</h2>
            <p className='profile-sub'>Overview of your current course.</p>

            {courseStatus && (
              <div
                className={`profile-msg ${
                  courseStatus.startsWith('ok:') ? 'success' : 'error'
                }`}
              >
                {courseStatus.replace(/^(ok:|error:)\s?/, '')}
              </div>
            )}

            {coursesMsg && <p className='profile-msg error'>{coursesMsg}</p>}
          </section>
        )}
      </div>
    </main>
  );
}
