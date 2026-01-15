
"use client";
import { useEffect, useState } from "react";
import PackageForm from "../components/PackageForm";
import { packageRoutes } from "@/modules/package/package.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";
import { usePermissionStore } from '@/modules/utils';

const CreatePackage = () => {
    const [loading, setLoading] = useState(true);
    const { currentUser } = usePermissionStore()


    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Packages',
                            route: packageRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new Package",
                            route: "#"
                        },
                    ]}
                />
            </div>
            <PackageForm payload={null} isEdit={false} />

        </div>
    );
}

export default CreatePackage;