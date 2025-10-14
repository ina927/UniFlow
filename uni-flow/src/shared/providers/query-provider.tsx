"use client";

import React from "react";
import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { makeQueryClient } from "../lib/react-query";

// Create a client component that wraps the app with QueryClientProvider
export function QueryProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
} 
