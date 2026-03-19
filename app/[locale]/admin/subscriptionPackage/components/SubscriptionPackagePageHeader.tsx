"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { subscriptionPackageRoutes } from "@/modules/subscriptionPackages/subscriptionPackages.routes";

interface Props {
    canCreate: boolean,
}
const SubscriptionPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(subscriptionPackageRoutes.create) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Subscription Packages</h1>
            {
                props.canCreate &&
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="ml-auto"
                    onClick={handleAdd}
                >
                    New Subscription
                </Button>
            }
        </div>
    )
}

export default SubscriptionPageHeader;