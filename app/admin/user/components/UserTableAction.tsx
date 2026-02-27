import { IUser } from '@/modules/user';
import { ChevronDown, Lock, PanelRightInactiveIcon } from "lucide-react";
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { useRouter } from "next/navigation";

interface Props {
    user: IUser
    onReset: (id: number) => void;
}



const UserTableAction = (props: Props) => {

    const router = useRouter();

    const items: MenuProps['items'] = [
        {
            key: '1',
            icon: <PanelRightInactiveIcon />,
            label: 'Roles',
            onClick: () => router.push("/admin/role")
        },
        {
            key: '2',
            icon: <Lock />,
            label: 'Reset password',
            onClick: () => props.onReset(props.user.id)
        },
    ];
    const handleMenuClick: MenuProps['onClick'] = (e) => { };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    return (<>
        <Dropdown menu={menuProps}>
            <Button type="link">
                <Space>
                    More <ChevronDown />
                </Space>
            </Button>
        </Dropdown>
    </>);
}

export default UserTableAction;