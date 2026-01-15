"use client";

import Logo from "../(client)/components/logo";
import React, { useEffect, useState } from "react";
import { MenuFoldOutlined } from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { Button, Drawer, Layout, Menu, Space } from "antd";
import RenderMenuItem from "@/app/admin/components/layout/RenderMenuItem";
import { adminMenus, menuItems } from "@/app/admin/components/layout/menus";
import AccountDropdown from "@/app/admin/components/layout/AccountDropdown";
import { usePermissionStore } from "@/modules/utils/permission/permission.store";

const { Header, Content, Sider } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {

  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname()
  const { isAdmin, currentUser, fetchFromLocalStorage, checkPermission, permissions } = usePermissionStore()

  const handleItemClick = (menuItem: any) => {
    router.push(menuItem.path);
    setOpen(false)
    setSelectedKey(menuItem.key);
  };
  const onClickDrawer = (value: boolean) => {
    setOpen(value)
  }


  const headerStyle = {
    padding: 0,
    background: '#fff',
  };
  const getSelectedKey = () => {
    let key;
    const currentMenus = getCurrentMenus();
    currentMenus.forEach((element: any) => {
      if (element.path == pathname) {
        key = element.key
      }
    });
    return key || '';
  }

  const getCurrentMenus = () => {
    // If user is admin, show all admin menus
    if (isAdmin) {
      return adminMenus;
    }
    
    // For non-admin users, show a filtered version of adminMenus based on permissions
    // This allows customers and other roles to see MOT System modules they have access to
    return adminMenus.filter(menuItem => {
      // Always show Dashboard
      if (menuItem.key === "1") return true;
      
      // Check if user has permission for this menu item
      if (menuItem.permission) {
        return checkPermission(permissions, menuItem.permission);
      }
      
      // For submenus, check if any submenu item is accessible
      if (menuItem.items && menuItem.items.length > 0) {
        const hasAccessibleSubmenu = menuItem.items.some(subItem => {
          if (subItem.permission) {
            return checkPermission(permissions, subItem.permission);
          }
          return true;
        });
        return hasAccessibleSubmenu;
      }
      
      return false;
    });
  }


  
  useEffect(() => {
    if (!currentUser) { fetchFromLocalStorage() }
  }, [fetchFromLocalStorage, selectedKey])

  const ToggleButton = () => (
    <span className="flex justify-center">
      <Button
        type="text"
        icon={<MenuFoldOutlined />}
        onClick={() => onClickDrawer(true)}
        style={{
          fontSize: "24px",
          width: 64,
          height: 64,
        }}
      />
    </span>
  );

  return (
    <Layout>

      {/* Desktop view */}
      {/* <Sider
        width={250}
        style={{ background: "white" }}
        breakpoint="lg"
        collapsible
        trigger={null}
        collapsedWidth={80}
        className="hidden flex-shrink-0 pb-4 overflow-y-auto md:block"
      >
        <div className="flex items-center justify-between px-3 pt-2">
          <div className="flex justify-center font-bold">
            <div className="ml-4"> <Logo /></div>
          </div>
        </div>
        <div className="border border-gray-50 mb-3"></div>
        {
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ background: "white", marginTop: "5%" }}
            className="shadow"
          >
            {getCurrentMenus().map((menuItem: any) =>
              RenderMenuItem(menuItem, handleItemClick, checkPermission, permissions)
            )}
          </Menu>
        }
      </Sider> */}

      {/* Mobile view  */}
      <Drawer
        open={open}
        closable={false}
        placement={'left'}
        title={
          (<div className="flex items-center justify-between px-3">
            <div className="ml-4"> <Logo /></div>
          </div>
          )
        }
        extra={
          <Space>
            <Button type="link" onClick={() => onClickDrawer(false)}>Close</Button>
          </Space>
        }
      >
        {
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={["1"]}
            selectedKeys={[getSelectedKey()]}
            style={{ background: "white", marginTop: "5%" }}
          >
            {getCurrentMenus().map((menuItem: any) =>
              RenderMenuItem(menuItem, handleItemClick, checkPermission, permissions)
            )}
          </Menu>
        }
      </Drawer>

      {/* Root Layout  */}
      <Layout>
        <Header style={headerStyle} className="flex justify-between">
          <div className="flex flex-row justify-between">
            <div className="md:hidden block"><ToggleButton /></div>
            <div className="md:block pl-4">
              {/* TODO Add Action Button */}
            </div>
          </div>
          <Space className="px-4">
            <AccountDropdown currentUser={currentUser} />
          </Space>
        </Header>

        <Content className="h-screen bg-slate-50" style={{ padding: "24px 16px 0" }}>
          <div className="">{children}</div>
        </Content>
      </Layout>

    </Layout>
  );
};

export default AdminLayout;
