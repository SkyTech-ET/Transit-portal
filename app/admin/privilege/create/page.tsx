
"use client";

import PrivilegeForm from "../components/PrivilegeForm";
import { privilegeRoutes } from "@/modules/privilege/privilege.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreatePrivilege = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Privileges',
                            route: privilegeRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new privilege",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <PrivilegeForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreatePrivilege;