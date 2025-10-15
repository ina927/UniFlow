"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAcademicStore, useAuthStore } from "@/shared/stores";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [dob, setDob] = useState("");
  const [degree, setDegree] = useState("");
  const [credits, setCredits] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUserId } = useAuthStore();
  const { setAcademicCourseId } = useAcademicStore();

  async function signUp() {
    setMsg(null);
    if (!email || !pwd) return setMsg("email & password required");
    if (pwd !== confirmPwd) return setMsg("passwords must match");

    const trimmedDegree = degree.trim();
    if (!trimmedDegree) return setMsg("degree is required");

    const creditNumber = Number(credits);
    if (!Number.isFinite(creditNumber) || creditNumber <= 0) {
      return setMsg("total credits must be a positive number");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pwd, dob }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data?.error || "Sign up failed"); return; }

      const createdUser = data?.data?.data;
      if (!createdUser?.id) {
        setMsg("unable to create course for new user");
        return;
      }

      const courseRes = await fetch("/api/academic-courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-id": createdUser.id,
        },
        body: JSON.stringify({ degree: trimmedDegree, credits: creditNumber }),
      });

      if (!courseRes.ok) {
        const courseData = await courseRes.json().catch(() => null);
        setMsg(courseData?.error || "failed to save academic details");
        return;
      }

      setUserId(createdUser.id);
      setAcademicCourseId((await courseRes.json())?.data?.data?.id);

      router.push("/academic"); // send new users straight to the academic hub
    } finally { setLoading(false); }
  }

  return (
    <main className="login-wrap">
      <div className="register-grid">
        <section className="login-card register-user-card">
          <h1 className="login-title">Create Account</h1>
          <div className="login-form">
            <label className="login-label">
              <span>Name<span className="required">*</span></span>
              <input className="login-input" value={name} onChange={e=>setName(e.target.value)} />
            </label>
            <label className="login-label">
              <span>Email<span className="required">*</span></span>
              <input className="login-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
            </label>
            <label className="login-label">
              <span>Password<span className="required">*</span></span>
              <input className="login-input" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
            </label>
            <label className="login-label">
              <span>Confirm Password<span className="required">*</span></span>
              <input
                className="login-input"
                type="password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
            </label>
            <label className="login-label">
              <span>Date of Birth</span>
              <input
                className="login-input"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="login-card register-academic-card">
          <h2 className="register-card-title">Academic Details</h2>
          <p className="register-card-sub">Tell us about your current course.</p>
          <div className="login-form">
            <label className="login-label">
              <span>Degree<span className="required">*</span></span>
              <input
                className="login-input"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="i.e. Bachelor of Information Technology"
              />
            </label>
            <label className="login-label">
              <span>Total Credits<span className="required">*</span></span>
              <input
                className="login-input"
                type="number"
                min="1"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="i.e. 144"
              />
            </label>
          </div>
        </section>
      </div>
      {msg && <p className="login-msg error register-error">{msg}</p>}
      <div className="login-actions register-actions">
        <button className="pill-btn pill-secondary" type="button" onClick={()=>router.push("/")}>
          Back to Login
        </button>
        <button className="pill-btn pill-primary" type="button" onClick={signUp} disabled={loading}>
          {loading ? "Signing up…" : "Sign Up"}
        </button>
      </div>
    </main>
  );
}
