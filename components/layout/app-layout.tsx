"use client";

import React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAppStore } from "@/lib/store/app-context";
import { Toast } from "../ui/tabs";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { toast, clearToast } = useAppStore();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>{children}</main>
      </div>
      <Toast msg={toast?.msg || null} type={toast?.type || "success"} onClose={clearToast} />
    </div>
  );
}
