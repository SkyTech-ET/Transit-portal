
"use client";

import RoleForm from "../components/RoleForm";
import { roleRoutes } from "@/modules/role/role.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateRole = () => {
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
                            title: "Create new role",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <RoleForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateRole;