
"use client";

import { useEffect } from "react";
import vendorSubscriptionForm from "../components/vendorSubscriptionForm";
import { vendorSubscriptionRoutes } from "@/modules/vendorSubscription/vendorSubscription.routes";
import { useVendorSubscriptionStore } from "@/modules/vendorSubscription/vendorSubscription.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";
import VendorSubscriptionForm from "../components/vendorSubscriptionForm";

interface Props {
    params: {
        id: number;
    };
}
const EditVendorSubscription = ({ params }: Props) => {
    const { listLoading, subscription, getVendorSubscription } = useVendorSubscriptionStore();
    useEffect(() => { getVendorSubscription(params.id) }, [getVendorSubscription])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Subscriptions',
                            route: vendorSubscriptionRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Subscription info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <VendorSubscriptionForm payload={subscription} isEdit={true} />

            <LoadingDialog visible={listLoading} />
            
        </div>
    );
}

export default EditVendorSubscription;