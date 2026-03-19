
"use client";

import VendorForm from "../components/VendorForm";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateVendor = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb items={[
                    {
                        key: 1,
                        title: 'Vendors',
                        route: vendorRoutes.getall,
                    },
                    {
                        key: 2,
                        title: "Create new vendor",
                        route: "#"
                    },
                ]} />
            </div>

            <VendorForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateVendor;