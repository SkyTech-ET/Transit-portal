"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { userRoutes } from "@/modules/user/user.routes";

interface Props {
    canCreate: boolean,
}
const UserPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(userRoutes.create) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Users</h1>
            {
                props.canCreate &&
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="ml-auto"
                    onClick={handleAdd}
                >
                    New user
                </Button>
            }
        </div>
    )
}

export default UserPageHeader;