"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import AdminSideBar from "../components/layout/AdminSideBar";

export default function AdminSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const t = useTranslations("AdminSidebar");
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="sm: fixed h-full w-64 border-r border-gray-200 bg-white sm:static">
        <AdminSideBar onLinkClick={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center border-b border-gray-200 bg-white p-4 sm:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-2 hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-lg font-semibold">{t("dashboard")}</h1>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
