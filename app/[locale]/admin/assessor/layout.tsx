"use client";

import { useState } from "react";
import AssessorSidebar from "../components/layout/AssessorSidebar";

export default function AssessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile Header */}
      <header className="flex items-center justify-between px-4 h-14 bg-white border-b md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="text-xl"
        >
          ☰
        </button>

        <span className="font-semibold">Transit</span>

        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-60 bg-white border-r
            transform transition-transform duration-200
            ${open ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0
          `}
        >
          <AssessorSidebar />

          {/* Close button (mobile only) */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 md:hidden"
          >
            ✕
          </button>
        </aside>

        {/* Overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 z-30 md:hidden"
          />
        )}

        {/* Content */}
        <main className="flex-1 w-full px-3 py-4 md:px-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
