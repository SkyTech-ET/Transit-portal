
"use client";

import { useEffect } from "react";
import PrivilegeForm from "../components/PrivilegeForm";
import { privilegeRoutes } from "@/modules/privilege/privilege.routes";
import { usePrivilegeStore } from "@/modules/privilege/privilege.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditPrivilege = ({ params }: Props) => {
    const { privilege, listLoading, getPrivilege } = usePrivilegeStore();
    useEffect(() => { getPrivilege(params.id) }, [getPrivilege])

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
                            title: "Edit privilege info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <PrivilegeForm payload={privilege} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditPrivilege;