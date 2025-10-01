"use client";

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
        </div>
      </section>
    </main>
  );
}
