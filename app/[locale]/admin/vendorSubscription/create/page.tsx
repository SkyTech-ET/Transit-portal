
"use client";

import VendorSubscriptionForm from "../components/vendorSubscriptionForm";
import { vendorSubscriptionRoutes } from "@/modules/vendorSubscription/vendorSubscription.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateVendorSubscription = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'subscriptions',
                            route: vendorSubscriptionRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new subscriptions",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <VendorSubscriptionForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateVendorSubscription;