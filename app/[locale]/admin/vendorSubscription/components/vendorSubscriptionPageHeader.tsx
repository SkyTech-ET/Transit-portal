"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { vendorSubscriptionRoutes } from "@/modules/vendorSubscription/vendorSubscription.routes";

interface Props {
    canCreate: boolean,
}
const VendorSubscriptionPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(vendorSubscriptionRoutes.create) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Subscriptions</h1>
        </div>
    )
}

export default VendorSubscriptionPageHeader;