
"use client";

import { useEffect } from "react";
import TagForm from "../components/tagForm";
import { tagRoutes } from "@/modules/tag/tag.routes";
import { useTagStore } from "@/modules/tag/tag.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}
const EditTag = ({ params }: Props) => {
    const { listLoading, tag, getTag } = useTagStore();
    useEffect(() => { getTag(params.id) }, [getTag])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Tags',
                            route: tagRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Tag info",
                            route: "#"
                        },
                    ]}
                />
            </div>


            <LoadingDialog visible={listLoading} />
            <TagForm payload={tag} isEdit={true} />
            
        </div>
    );
}

export default EditTag;