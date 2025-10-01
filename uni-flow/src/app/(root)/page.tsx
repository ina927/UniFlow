"use client";

<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
<<<<<<<< HEAD:uni-flow/src/app/(root)/page.tsx
import { Role } from "@/shared/generated/prisma";
========
import { Role } from "@/entities/users/enums";
>>>>>>>> ba6d03e ([refectory] F101-user_authentication):uni-flow/src/app/(root)/home/page.tsx

type User = { email: string; name?: string; role?: Role };

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/user/me", { cache: "no-store" });
      if (res.status === 401) { router.replace("/?reason=auth"); return; }
      const data = await res.json();
      setUser(data.user || null);
    })();
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <main className="profile-wrap">
      <section className="profile-card">
        <h2 className="profile-title">
          Welcome{user?.name ? `, ${user.name}` : ""} 👋
        </h2>
        <p className="profile-sub">
          Signed in as <b>{user?.email}</b>
        </p>

        <div className="profile-actions">
          <button className="pill-btn pill-primary" onClick={() => router.push("/profile")}>
            Go to Profile
          </button>
          {user?.role === Role.ADMIN && (
            <button className="pill-btn pill-secondary" onClick={() => router.push("/admin")}>
              Admin Dashboard
            </button>
          )}
          <button className="pill-btn pill-secondary" onClick={logout}>
            Logout
          </button>
=======
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function signIn() {
    setMsg(null);
    if (!email || !pwd) return setMsg("email & password required");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pwd }),
    });

    const raw = await res.text();
    let data: unknown = null;
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.warn("login response not JSON", err);
      }
    }

    const payload =
      data && typeof data === "object" ? (data as { error?: string }) : null;
    if (!res.ok) {
      const message = payload?.error || raw || `Sign in failed (${res.status})`;
      return setMsg(message);
    }

    router.push("/home"); // ⬅️ go to landing page
  }

  return (
    <main className="login-wrap">
      <section className="login-card">
        <h1 className="login-title">Please Login</h1>

        <div className="login-form">
          <label className="login-label">
            <span>Email</span>
            <input
              className="login-input"
              type="email"
              placeholder="someone@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="login-label">
            <span>Password</span>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
          </label>

          <button className="forgot-btn" disabled>Forgot Password</button>
          {msg && <p className="login-msg error">{msg}</p>}

          <div className="login-actions">
            <button
              type="button"
              className="pill-btn pill-secondary"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </button>
            <button type="button" className="pill-btn pill-primary" onClick={signIn}>
              <span className="play">▶</span> Sign In
            </button>
          </div>
>>>>>>> ba6d03e ([refectory] F101-user_authentication)
        </div>
      </section>
    </main>
  );
}
