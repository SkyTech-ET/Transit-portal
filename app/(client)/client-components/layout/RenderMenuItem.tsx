import { Menu } from "antd";
import { MenuItem } from "./menus";

const RenderMenuItem = (menuItem: MenuItem, onTapMenu: Function, checkPermission: Function, permissions: any[]) => {

    if (menuItem.permission && !checkPermission(permissions, menuItem.permission)) {
        return null;
    }

    if (menuItem.items && menuItem.items.length > 0) {
        return (
            <Menu.SubMenu
                key={menuItem.key}
                title={menuItem.label}
                icon={menuItem.icon}
            >
                {menuItem.items.map((item) => RenderMenuItem(item, onTapMenu, checkPermission, permissions))}
            </Menu.SubMenu>
        );
    }
    return (
        <Menu.Item
            key={menuItem.key}
            icon={menuItem.icon}
            onClick={() => onTapMenu(menuItem)}
        >
            {menuItem.label}
        </Menu.Item>
    );
};

export default RenderMenuItem;
