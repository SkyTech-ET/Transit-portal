"use client";

import CaseExecutorSidebar from "../components/layout/CaseExecutorSidebar";

export default function CaseExecutorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: "#FFFFFF",
          borderRight: "1px solid #F0F0F0",
        }}
      >
        <CaseExecutorSidebar />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          padding: 24,
          background: "#F8FAFC",
        }}
      >
        {children}
      </div>
    </div>
  );
}
