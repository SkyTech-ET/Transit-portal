
"use client";
import { useEffect, useState } from "react";
import EventForm from "../components/ContactForm";
import { eventRoutes } from "@/modules/event/event.routes";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";
//import { getServices } from "@/modules/event/event.store"; // Import your getServices function
import { useEventStore } from "@/modules/event/event.store"; // Import your event store
import { usePermissionStore } from '@/modules/utils';

const CreateEvent = () => {
    //const [services, setServices] = useState<any[]>([]); // Update the type based on your actual service data structure
    const [loading, setLoading] = useState(true);
    const { currentUser } = usePermissionStore()
    const orgId = currentUser?.organization?.id;
    // useEffect(() => {
    //     const fetchServices = async () => {
    //         if (!orgId) return; // Ensure orgId is available before calling the API
    //         try {
    //             const result = await getServices(orgId); // Ensure you use the correct function name
    //             setServices(result); // Call setServices to update the store
    //         } catch (error) {
    //             console.error('Error fetching services:', error);
    //         }
    //     };

    //     fetchServices();
    // }, [orgId]); // Dependency on currentUser

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