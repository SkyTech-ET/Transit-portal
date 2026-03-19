"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";

interface Props {
    canCreate: boolean,
}

const VendorPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(vendorRoutes.crate) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Vendors</h1>
            {
                props.canCreate &&
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="ml-auto"
                    onClick={handleAdd}
                >
                    New vendor
                </Button>
            }
        </div>
    )
}

export default VendorPageHeader;