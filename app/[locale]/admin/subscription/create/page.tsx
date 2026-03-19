
"use client";

import SubscriptionForm from "../components/SubscriptionForm";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateSubscription = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'subscriptions',
                            route: subscriptionRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new subscriptions",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <SubscriptionForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateSubscription;