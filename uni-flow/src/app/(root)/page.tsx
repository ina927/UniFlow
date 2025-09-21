"use client";

import { redirect } from "next/navigation";
import { useAuthStore } from "@/shared/stores";

export default function HomePage() {
  const { userId } = useAuthStore();

  if (userId) {
    redirect("/academic");
  }

  return (
    <div>Home</div>
  );
}
