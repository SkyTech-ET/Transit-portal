"use client";

import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { managerSidebarMenu, managerLogoutItem } from "./managerSidebar.config";

export default function ManagerSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-[260px] h-screen bg-white border-r flex flex-col justify-between">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="px-6 py-5 text-xl font-bold text-blue-600">
          MOHAMMED
        </div>

        {/* MENU */}
        {managerSidebarMenu.map((group) => (
          <div key={group.section} className="mt-4">
            <div className="px-6 text-xs text-gray-400 uppercase mb-2">
              {group.section}
            </div>

            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              className="border-none"
              onClick={({ key }) => router.push(key)}
              items={group.items.map((item) => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
              }))}
            />
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="p-4">
        <Menu
          mode="inline"
          className="border-none text-red-500"
          onClick={() => router.push(managerLogoutItem.key)}
          items={[
            {
              key: managerLogoutItem.key,
              icon: managerLogoutItem.icon,
              label: managerLogoutItem.label,
              danger: true,
            },
          ]}
        />
      </div>
    </aside>
  );
}
