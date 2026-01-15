"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { subscriptionRoutes } from "@/modules/subscription/subscription.routes";

interface Props {
    canCreate: boolean,
}
const SubscriptionPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(subscriptionRoutes.create) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Subscriptions</h1>
        </div>
    )
}

export default SubscriptionPageHeader;