"use client";

import { useState } from "react";
import AdminSideBar from "../components/layout/AdminSideBar";
import { Menu } from "lucide-react";

export default function AdminSideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed sm:static z-50 h-full bg-white border-r border-gray-200 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 w-64`}
      >
        <AdminSideBar onLinkClick={() => setSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="sm:hidden flex items-center p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 font-semibold text-lg">Dashboard</h1>
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
