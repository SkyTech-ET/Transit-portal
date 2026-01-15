
"use client";

import { useEffect } from "react";
import SubscriptionForm from "../components/SubscriptionForm";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";
import { useSubscriptionStore } from "@/modules/subscription/subscription.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}
const EditSubscription = ({ params }: Props) => {
    const { listLoading, subscription, getSubscription } = useSubscriptionStore();
    useEffect(() => { getSubscription(params.id) }, [getSubscription])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Subscriptions',
                            route: subscriptionRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Subscription info",
                            route: "#"
                        },
                    ]}
                />
            </div>


            <LoadingDialog visible={listLoading} />
            
        </div>
    );
}

export default EditSubscription;