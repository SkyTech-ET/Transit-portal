
"use client";

import { useEffect } from "react";
import EventForm from "./../components/EventForm";
import { useEventStore } from "@/modules/event/event.store";
import { eventRoutes } from "@/modules/event/event.routes";
import LoadingDialog from "@/app/admin/components/common/LoadingDialog";
import CustomBreadcrumb from "@/app/admin/components/common/CustomBreadcrumb";


interface Props {
    params: {
        id: number;
    };
}

const EditEvent = ({ params }: Props) => {
    const { listLoading, event, getEvent } = useEventStore();
    useEffect(() => { getEvent(params.id) }, [getEvent])

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
                            title: "Edit event info",
                            route: "#"
                        },
                    ]}
                />
            </div>
            <LoadingDialog visible={listLoading} />
            <EventForm payload={event} isEdit={true} />
        </div>
    );
}

export default EditEvent;