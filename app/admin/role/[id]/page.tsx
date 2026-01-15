
"use client";

import { useEffect } from "react";
import RoleForm from "../components/RoleForm";
import { roleRoutes } from "@/modules/role/role.routes";
import { useRoleStore } from "@/modules/role/role.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditRole = ({ params }: Props) => {
    const { listLoading, role, getRole } = useRoleStore();
    useEffect(() => { getRole(params.id) }, [getRole])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Roles',
                            route: roleRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit role info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <RoleForm payload={role} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditRole;