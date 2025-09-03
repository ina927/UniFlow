"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd]     = useState("");
  const [msg, setMsg]     = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setMsg(null);
<<<<<<< HEAD
    if (!email.includes("@")) return setMsg("invalid email");
=======
>>>>>>> 457c526 (feat(auth): add F101 user authentication prototype and stub unfinished APIs)
    if (!email || !pwd) return setMsg("email & password required");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pwd }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg(data?.error || "Sign up failed"); return; }
      router.push("/home"); // ⬅️ go to landing page
    } finally { setLoading(false); }
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <h1 className="login-title">Create Account</h1>
        <div className="login-form">
          <label className="login-label">
            <span>Name</span>
            <input className="login-input" value={name} onChange={e=>setName(e.target.value)} />
          </label>
          <label className="login-label">
            <span>Email</span>
            <input className="login-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </label>
          <label className="login-label">
            <span>Password</span>
            <input className="login-input" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} />
          </label>
          {msg && <p className="login-msg error">{msg}</p>}
          <div className="login-actions">
            <button className="pill-btn pill-secondary" type="button" onClick={()=>router.push("/")}>
              Back to Login
            </button>
            <button className="pill-btn pill-primary" type="button" onClick={signUp} disabled={loading}>
              {loading ? "Signing up…" : "Sign Up"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}