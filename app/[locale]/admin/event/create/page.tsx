
"use client";
import { useEffect, useState } from "react";
import EventForm from "../components/EventForm";
import { eventRoutes } from "@/modules/event/event.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";
//import { getServices } from "@/modules/event/event.store"; // Import your getServices function
import { useEventStore } from "@/modules/event/event.store"; // Import your event store
import { usePermissionStore } from '@/modules/utils';

const CreateEvent = () => {
    const [loading, setLoading] = useState(true);
    const { currentUser } = usePermissionStore()
    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Events',
                            route: eventRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Create new Event",
                            route: "#"
                        },
                    ]}
                />
            </div>
            <EventForm payload={null} isEdit={false} />

        </div>
    );
}

export default CreateEvent;