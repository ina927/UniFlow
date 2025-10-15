"use client";

import { UserStatus, Role } from "@/entities/users";
import { useEffect, useMemo, useState } from "react";

const statusLabels: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Active",
  [UserStatus.INACTIVE]: "Inactive",
  [UserStatus.SUSPENDED]: "Suspended",
};

const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: "Admin",
  [Role.STUDENT]: "Student",
  [Role.TEACHER]: "Teacher",
};

type AdminUser = {
  id: string;
  name: string;
  role: Role;
  email: string;
  hash: string;
  dob: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  version: number;
};

type AuditAction =
  | "USER_CREATED"
  | "USER_EDITED"
  | "USER_DEACTIVATED"
  | "USER_REACTIVATED"
  | "USER_RESET";

type AuditEntry = {
  id: string;
  actor: string;
  action: AuditAction;
  details: string | null;
  createdAt?: string | null;
};

type DashboardResponse = {
  users: AdminUser[];
  audits: AuditEntry[];
};

const actionIcons: Record<AuditAction, string> = {
  USER_CREATED: "✅",
  USER_EDITED: "🛠️",
  USER_DEACTIVATED: "⛔",
  USER_REACTIVATED: "✅",
  USER_RESET: "🔁",
};

function formatTimestamp(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [audits, setAudits] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; role: Role; status: UserStatus } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/dashboard", { cache: "no-store" });
        if (!res.ok) {
          const errorBody = await res.json().catch(() => null);
          const reason =
            (errorBody && typeof errorBody.message === "string" && errorBody.message) ||
            `Request failed (${res.status})`;
          throw new Error(reason);
        }
        const data = (await res.json()) as DashboardResponse;
        setUsers(data.users);
        setAudits(data.audits);
      } catch (err) {
        const details = err instanceof Error ? err.message : "Unknown error";
        console.error("Failed to load admin dashboard data", err);
        setUsers([]);
        setAudits([]);
        setBanner(`Unable to load admin dashboard. ${details}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recentActivity = useMemo(() => audits.slice(0, 8), [audits]);
  const auditLogRows = useMemo(() => audits.slice(0, 12), [audits]);

  function startEdit(user: AdminUser) {
    setEditingId(user.id);
    setEditForm({
      name: user.name || "",
      role: user.role,
      status: user.status,
    });
    setBanner(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit(user: AdminUser) {
    if (!editForm) return;
    const payload: Partial<typeof editForm> = {};
    if (editForm.name.trim() !== user.name) payload.name = editForm.name;
    if (editForm.role !== user.role) payload.role = editForm.role;
    if (editForm.status !== user.status) payload.status = editForm.status;
    if (!Object.keys(payload).length) {
      setBanner("No changes to save.");
      cancelEdit();
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");

      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...data.user } : u)));
      setAudits((prev) => [data.audit, ...prev]);
      setBanner("User updated successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Update failed";
      console.error(message, err);
      setBanner(message);
    } finally {
      cancelEdit();
    }
  }

  async function changeStatus(user: AdminUser, status: UserStatus) {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Status update failed");

      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...data.user } : u)));
      setAudits((prev) => [data.audit, ...prev]);
      setBanner(
        status === UserStatus.ACTIVE
          ? `${user.email} reactivated.`
          : `${user.email} deactivated.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Status update failed";
      console.error(message, err);
      setBanner(message);
    }
  }

  async function resetUser(user: AdminUser) {
    try {
      const res = await fetch(`/api/admin/users/${user.id}/reset`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Reset failed");

      setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, ...data.user } : u)));
      setAudits((prev) => [data.audit, ...prev]);
      setBanner(`Account reset. Temporary password: ${data.tempPassword}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Reset failed";
      console.error(message, err);
      setBanner(message);
    }
  }

  if (loading) {
    return (
      <main className="admin-wrap">
        <div className="admin-card">Loading admin dashboard…</div>
      </main>
    );
  }

  return (
    <main className="admin-wrap">
      <div className="admin-layout">
        <section className="admin-main">
          <header className="admin-header">
            <h1 className="text-large-title-bold">Admin Dashboard</h1>
            <p className="text-body1 text-secondary">
              Monitor all user accounts, adjust access, and review system activity.
            </p>
          </header>

          {banner && <div className="admin-banner">{banner}</div>}

          <section className="admin-card">
            <h2 className="text-title2-bold">User List</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date of Birth</th>
                    <th>Password Hash</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Version</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isEditing = editingId === user.id;
                    return (
                      <tr key={user.id} className={user.status !== UserStatus.ACTIVE ? "inactive" : undefined}>
                        <td className="mono">{user.id}</td>
                        <td>
                          <a href={`mailto:${user.email}`} className="admin-link">
                            {user.email}
                          </a>
                        </td>
                        <td>
                          {isEditing ? (
                            <input
                              className="admin-input"
                              value={editForm?.name ?? ""}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev ? { ...prev, name: e.target.value } : prev
                                )
                              }
                            />
                          ) : (
                            user.name
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              className="admin-input"
                              value={editForm?.role ?? user.role}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? { ...prev, role: e.target.value as Role }
                                    : prev
                                )
                              }
                            >
                              {Object.values(Role)
                                .filter((role) => role !== Role.ADMIN)
                                .map((role) => (
                                  <option key={role} value={role}>
                                    {roleLabels[role]}
                                  </option>
                                ))}
                            </select>
                          ) : (
                            roleLabels[user.role]
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <select
                              className="admin-input"
                              value={editForm?.status ?? user.status}
                              onChange={(e) =>
                                setEditForm((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        status: e.target.value as UserStatus,
                                      }
                                    : prev
                                )
                              }
                            >
                              {Object.values(UserStatus).map((status) => (
                                <option key={status} value={status}>
                                  {statusLabels[status]}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={`status-pill ${user.status.toLowerCase()}`}>
                              {statusLabels[user.status]}
                            </span>
                          )}
                        </td>
                        <td>{formatDate(user.dob)}</td>
                        <td className="mono">
                          {user.hash.length > 14
                            ? `${user.hash.slice(0, 10)}…${user.hash.slice(-4)}`
                            : user.hash}
                        </td>
                        <td>{formatTimestamp(user.createdAt)}</td>
                        <td>{formatTimestamp(user.updatedAt)}</td>
                        <td className="mono">{user.version}</td>
                        <td className="actions">
                          {isEditing ? (
                            <div className="admin-actions">
                              <button
                                className="pill-btn pill-primary"
                                onClick={() => saveEdit(user)}
                              >
                                Save
                              </button>
                              <button
                                className="pill-btn pill-secondary"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="admin-actions">
                              <button
                                className="pill-btn pill-primary"
                                onClick={() => startEdit(user)}
                              >
                                Edit
                              </button>
                              <button
                                className="pill-btn pill-secondary"
                                onClick={() =>
                                  changeStatus(
                                    user,
                                    user.status === UserStatus.ACTIVE
                                      ? UserStatus.INACTIVE
                                      : UserStatus.ACTIVE
                                  )
                                }
                              >
                                {user.status === UserStatus.ACTIVE ? "Deactivate" : "Reactivate"}
                              </button>
                              <button
                                className="pill-btn pill-danger"
                                onClick={() => resetUser(user)}
                              >
                                Reset
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-card">
            <h2 className="text-title2-bold">Audit Log</h2>
            <div className="audit-log">
              {auditLogRows.map((entry) => (
                <div key={entry.id} className="audit-row">
                  <span className="timestamp">{formatTimestamp(entry.createdAt)}</span>
                  <span className="actor">{entry.actor}</span>
                  <span className="action">{entry.action.replace("USER_", "")}</span>
                  <span className="details">{entry.details ?? "No details recorded."}</span>
                </div>
              ))}
              {!auditLogRows.length && <p className="text-secondary">No audit activity yet.</p>}
            </div>
          </section>
        </section>

        <aside className="admin-sidebar">
          <section className="admin-card">
            <h2 className="text-title2-bold">Recent Activity</h2>
            <ul className="recent-activity">
              {recentActivity.map((entry) => (
                <li key={entry.id}>
                  <span className="icon">{actionIcons[entry.action]}</span>
                  <div>
                    <p>
                      {entry.actor} • {entry.action.replace("USER_", "")}
                    </p>
                    <small>{entry.details ?? "No extra details."}</small>
                    <small>{formatTimestamp(entry.createdAt)}</small>
                  </div>
                </li>
              ))}
              {!recentActivity.length && <li>No recent activity.</li>}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}
