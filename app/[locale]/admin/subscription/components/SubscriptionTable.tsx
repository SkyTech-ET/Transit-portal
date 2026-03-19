"use client";

import React, { useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";
import { subscriptionRoutes } from "@/modules/subscription";
import { ISubscriptionTableRow } from "@/modules/subscription/subscription.types";
import { SubscriptionTableColumn } from "./SubscriptionTableColumn";
import { useSubscriptionStore } from "@/modules/subscription/subscription.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean;
    canUpdateReq: boolean;
    canUpdateAcc: boolean;
    canView: boolean;
    canViewOrgSubscriptions: boolean;
    subscriptions: ISubscriptionTableRow[];
    currentPage: number;
    totalPages: number;
    searchTerm: string;
}

const SubscriptionTable = (props: Props) => {
    const router = useRouter();
    const { deleteSubscription, getSubscriptions } = useSubscriptionStore();
    const canUpdateReq = props.canUpdateReq;
    const canUpdateAcc = props.canUpdateAcc;

    const [pagination, setPagination] = useState({
        current: props.currentPage || 1,
        pageSize: 10,
    });

    // Handle page changes
    const onPageChange = (page: number) => {
        setPagination({ current: page, pageSize: pagination.pageSize });
        getSubscriptions(RecordStatus.Active, page, props.searchTerm || "");
    };

    const onDelete = async (id: any) => {
        await deleteSubscription(id).then(() => {
            getSubscriptions(RecordStatus.Active, pagination.current, props.searchTerm || "");
        });
    };

    const onEdit = (id: number) => {
        router.push(subscriptionRoutes.edit + id);
    };

    // Generate visible page numbers with ellipses
    const renderPageNumbers = () => {
        const { current } = pagination;
        const { totalPages } = props;
        const pages = [];

        // Always show the first page
        if (current > 3) {
            pages.push(
                <Button key={1} onClick={() => onPageChange(1)} style={{ margin: "0 4px" }}>
                    1
                </Button>
            );
            if (current > 4) {
                pages.push(<span key="start-ellipsis">...</span>);
            }
        }

        // Show current page, two before, and two after
        const startPage = Math.max(1, current - 2);
        const endPage = Math.min(totalPages, current + 2);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    type={i === current ? "primary" : "default"}
                    onClick={() => onPageChange(i)}
                    style={{ margin: "0 4px" }}
                >
                    {i}
                </Button>
            );
        }

        // Always show the last page
        if (current < totalPages - 2) {
            if (current < totalPages - 3) {
                pages.push(<span key="end-ellipsis">...</span>);
            }
            pages.push(
                <Button key={totalPages} onClick={() => onPageChange(totalPages)} style={{ margin: "0 4px" }}>
                    {totalPages}
                </Button>
            );
        }

        return pages;
    };

    return (
        <>
            <Table
                id="id"
                size="small"
                loading={props.loading}
                dataSource={props.subscriptions}
                scroll={{ x: 700 }}
                columns={SubscriptionTableColumn({
                    canUpdateReq,
                    canUpdateAcc,
                    onEditAcc: function (id: number): void {
                        throw new Error("Function not implemented.");
                    },
                    onEditReq: function (id: number): void {
                        throw new Error("Function not implemented.");
                    },
                })}
                pagination={false} // Disable default pagination
            />

            {/* Custom Pagination Controls */}
            <div style={{ marginTop: 16, textAlign: "center" }}>
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
        </>
    );
};

export default SubscriptionTable;
