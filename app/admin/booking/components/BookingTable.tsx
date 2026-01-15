"use client";

import { Table, Button } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IBooking } from "@/modules/booking/booking.types";
import { BookingTableColumn } from "./BookingTableColumn";
import { useBookingStore } from "@/modules/booking/booking.store";
import { RecordStatus } from "@/modules/common/common.types";
import { bookingRoutes, getBookingsByOrg} from "@/modules/booking";

interface Props {
    loading: boolean,
    canUpdate: boolean,
    bookings: IBooking[],
    currentPage: number;
    totalPages: number;
}

const BookingTable = (props: Props) => {
    const router = useRouter()
    const { deleteBooking, getBookingsByOrg } = useBookingStore()
    const [pagination, setPagination] = useState({
        current: props.currentPage || 1,
        pageSize: 10,
    });

    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteBooking(id).then((res: any) => {
            getBookingsByOrg(RecordStatus.Active, RecordStatus.Active )
        })
    }
    const onEdit = (id: number) => {
        router.push(bookingRoutes.edit + id)
    }

    const onPageChange = (page: number) => {
        if (page < 1 || page > (props.totalPages || 1)) return; // Validate page number
        setPagination((prev) => ({ ...prev, current: page }));
        getBookingsByOrg(RecordStatus.Active, page, pagination.pageSize); // Fetch with pageSize
    };
    
    const renderPageNumbers = () => {
        const { current } = pagination;
        const totalPages = props.totalPages || 1;
        const pages = [];
    
        if (current > 3) {
            pages.push(
                <Button key={1} onClick={() => onPageChange(1)} style={{ margin: "0 4px" }}>
                    1
                </Button>
            );
            if (current > 4) pages.push(<span key="start-ellipsis">...</span>);
        }
    
        for (let i = Math.max(1, current - 2); i <= Math.min(totalPages, current + 2); i++) {
            pages.push(
                <Button
                    key={i}
                    type={i === current ? "primary" : "default"}
                    onClick={() => onPageChange(i)}
                    style={{ margin: "0 4px" }}
                    aria-label={`Go to page ${i}`}
                >
                    {i}
                </Button>
            );
        }
    
        if (current < totalPages - 2) {
            if (current < totalPages - 3) pages.push(<span key="end-ellipsis">...</span>);
            pages.push(
                <Button key={totalPages} onClick={() => onPageChange(totalPages)} style={{ margin: "0 4px" }}>
                    {totalPages}
                </Button>
            );
        }
    
        return pages;
    };
    


    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.bookings}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={BookingTableColumn({ canUpdate })}
            pagination={false} 
        />


        {/* Custom Pagination Controls */}
        <div style={{ marginTop: 16, textAlign: "right" }}>
                <Button
                    onClick={() => onPageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    style={{ marginRight: 8 }}
                >
                    Previous
                </Button>
                {renderPageNumbers()} {/* Render the page numbers with ellipses */}
                <Button
                       onClick={() => onPageChange(pagination.current + 1)}
                       disabled={pagination.current === props.totalPages}
                       style={{ marginLeft: 8 }}
                   >
                        Next
                    </Button>

            </div>
    </>)
}

export default BookingTable;