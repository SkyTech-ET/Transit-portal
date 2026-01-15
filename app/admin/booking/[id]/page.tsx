
"use client";

import { useEffect } from "react";
import BookingForm from "../components/BookingForm";
import { bookingRoutes } from "@/modules/booking/booking.routes";
import { useBookingStore } from "@/modules/booking/booking.store";
import LoadingDialog from "../../components/common/LoadingDialog";
import CustomBreadcrumb from "../../components/common/CustomBreadcrumb";

interface Props {
    params: {
        id: number;
    };
}

const EditBooking = ({ params }: Props) => {
    const { listLoading, booking, getBooking } = useBookingStore();
    useEffect(() => { getBooking(params.id) }, [getBooking])

    return (
        <div className="flex flex-col gap-4 rounded-md bg-white p-6">
            <div className="flex">
                <CustomBreadcrumb
                    items={[
                        {
                            key: 1,
                            title: 'Booking',
                            route: bookingRoutes.getall,
                        },
                        {
                            key: 2,
                            title: "Edit Booking info",
                            route: "#"
                        },
                    ]}
                />
            </div>

            <BookingForm payload={booking} isEdit={true} />
            <LoadingDialog visible={listLoading} />
        </div>
    );
}

export default EditBooking;