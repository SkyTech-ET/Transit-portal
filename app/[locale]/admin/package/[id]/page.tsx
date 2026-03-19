
"use client";

import { useEffect } from "react";
import PackageForm from "../components/PackageForm";
import { packageRoutes } from "@/modules/package/package.routes";
import { usePackageStore } from "@/modules/package/package.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditPackage = ({ params }: Props) => {
    const { listLoading, packageInd, getPackage } = usePackageStore();
    useEffect(() => { getPackage(params.id) }, [getPackage])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Package',
                            route: packageRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit package info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <PackageForm payload={packageInd} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditPackage;