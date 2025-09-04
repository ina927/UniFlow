"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [user, setUser] = useState<string>("");

  if (user) {
    redirect("/academic");
  }

  return (
    <div>Home</div>
  );
}
