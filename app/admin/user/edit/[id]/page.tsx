
"use client";

import { useEffect } from "react";
import UserForm from "../../components/UserForm";
import { useUserStore } from "@/modules/user/user.store";
import { userRoutes } from "@/modules/user/user.routes";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";


interface Props {
    params: {
        id: number;
    };
}

const EditUser = ({ params }: Props) => {
    const { listLoading, user, getUser } = useUserStore();
    useEffect(() => { getUser(params.id) }, [getUser])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Users',
                            route: userRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit user info",
                            route: "#"
                        },
                    ]}
                />
            </div>
            <LoadingDialog visible={listLoading} />
            <UserForm payload={user} isEdit={true} />
        </div>
    );
}

export default EditUser;