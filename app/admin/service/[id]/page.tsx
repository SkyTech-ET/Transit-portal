
"use client";

import { useEffect } from "react";
import ServiceForm from "../components/ServiceForm";
import { serviceRoutes } from "@/modules/service/service.routes";
import { useServiceStore } from "@/modules/service/service.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}
const EditService = ({ params }: Props) => {
    const { listLoading, service, getService } = useServiceStore();
    useEffect(() => { getService(params.id) }, [getService])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Services',
                            route: serviceRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Service info",
                            route: "#"
                        },
                    ]}
                />
            </div>


            <LoadingDialog visible={listLoading} />
            <ServiceForm payload={service} isEdit={true} />
            
        </div>
    );
}

export default EditService;