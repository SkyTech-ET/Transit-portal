
"use client";

import TagForm from "../components/tagForm";
import { tagRoutes } from "@/modules/tag/tag.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateTag = () => {
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'tags',
                            route: tagRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new tags",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <TagForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateTag;