"use client";

import DataEncoderSidebar from "../components/layout/DataEncoderSidebar";

export default function DataEncoderLayout({
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
        <DataEncoderSidebar />
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
