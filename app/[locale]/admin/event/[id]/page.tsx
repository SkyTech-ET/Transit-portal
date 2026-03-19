
"use client";

import { useEffect } from "react";
import EventForm from "../components/EventForm";
import { eventRoutes } from "@/modules/event/event.routes";
import { useEventStore } from "@/modules/event/event.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

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
                            title: 'Event',
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

            <EventForm payload={event} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditEvent;