
"use client";

import ServiceForm from "../components/ServiceForm";
import { serviceRoutes } from "@/modules/service/service.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

const CreateService = () => {
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
                            title: "Create new Service",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <ServiceForm payload={null} isEdit={false} />
        </div>
    );
}

export default CreateService;