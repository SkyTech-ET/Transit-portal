"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { tagRoutes } from "@/modules/tag/tag.routes";

interface Props {
    canCreate: boolean,
}
const TagPageHeader = (props: Props) => {
    const router = useRouter()
    const handleAdd = () => { router.push(tagRoutes.create) };

    return (
        <div className="flex px-6">
            <h1 className="text-lg font-bold">Tags</h1>
            {
                props.canCreate &&
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined />}
                    className="ml-auto"
                    onClick={handleAdd}
                >
                    New Tag
                </Button>
            }
        </div>
    )
}

export default TagPageHeader;