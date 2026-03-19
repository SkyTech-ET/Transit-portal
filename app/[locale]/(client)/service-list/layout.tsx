"use client";

import CustomerSidebar from "../client-components/layout/menus";
import ClientHeader from "../components/header";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <ClientHeader />

      {/* Main Section */}
      <div
        style={{
          display: "flex",
          flex: 1,
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
          <CustomerSidebar />
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
    </div>
  );
}
