
"use client";

import SubscriptionPackageForm from "../components/SubscriptionPackageForm";
import { subscriptionPackageRoutes } from "@/modules/subscriptionPackages/subscriptionPackages.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateSubscriptionPackage = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'subscription Package',
                            route: subscriptionPackageRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new subscription Package",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <SubscriptionPackageForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateSubscriptionPackage;