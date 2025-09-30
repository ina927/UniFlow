"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { email: string; name?: string };

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");
  const [msg, setMsg] = useState<string | null>(null); // "ok: ..." | "error: ..."
  const [loading, setLoading] = useState(true);

  // Prefill from /api/user/me, redirect to login on 401
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        if (res.status === 401) {
          // session expired / not logged in
          router.replace("/?reason=auth");
          return;
        }
        const data = await res.json();
        setUser(data.user || null);
        setName(data.user?.name || "");
      } catch {
        setMsg("error: failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // Save profile; on 401, redirect back to login
  async function save() {
    setMsg(null);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: pwd || undefined }),
      });

      if (res.status === 401) {
        router.replace("/?reason=auth");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setMsg(`error: ${data?.error || "Update failed"}`);
        return;
      }

      setMsg("ok: Profile updated");
      setPwd("");
    } catch {
      setMsg("error: network error");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (loading) return <div className="profile-wrap">Loading…</div>;

  return (
    <main className="profile-wrap">
      <section className="profile-card">
        <h2 className="profile-title">Profile</h2>
        <p className="profile-sub">
          Signed in as <b>{user?.email}</b>
        </p>

        {msg && (
          <div
            className={`profile-msg ${
              msg.startsWith("ok:") ? "success" : "error"
            }`}
          >
            {msg.replace(/^(ok:|error:)\s?/, "")}
          </div>
        )}

        <div className="profile-form">
          <label>
            <span>Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>

          <label>
            <span>New Password (optional)</span>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Set a new password"
            />
          </label>

          <div className="profile-actions">
            <button className="pill-btn pill-primary" onClick={save}>
              Save changes
            </button>
            <button className="pill-btn pill-secondary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}