
"use client";

import { useEffect } from "react";
import SubscriptionPackageForm from "../components/SubscriptionPackageForm";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";
import { useSubscriptionPackagesStore } from "@/modules/subscriptionPackages/subscriptionPackages.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}
const EditSubscriptionPackage = ({ params }: Props) => {
    const { listLoading, subscriptionPackage, getSubscriptionPackage } = useSubscriptionPackagesStore();
    useEffect(() => { getSubscriptionPackage(params.id) }, [getSubscriptionPackage])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Subscription Packages',
                            route: subscriptionRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Subscription Packages",
                            route: "#"
                        },
                    ]}
                />
            </div>


            <LoadingDialog visible={listLoading} />
            <SubscriptionPackageForm payload={subscriptionPackage} isEdit={true} />
            
        </div>
    );
}

export default EditSubscriptionPackage;