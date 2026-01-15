
"use client";

import { useEffect } from "react";
import VendorForm from "../../components/VendorForm";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditVendor = ({ params }: Props) => {
    const { vendor, listLoading, getVendor } = useVendorStore();
    useEffect(() => { getVendor(params.id) }, [getVendor])
    
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Vendors',
                            route: vendorRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit vendor info",
                            route: "#"
                        },
                    ]}
                />
            </div>
            <VendorForm payload={vendor} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditVendor;