"use client";

import React, { useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";

import { RecordStatus } from "@/modules/common/common.types";
import { VendorTableColumn } from "./VendorTableColumn";
import { IVendor } from "@/modules/vendor/vendor.types";
import { useVendorStore } from "@/modules/vendor/vendor.store";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";

interface Props {
    canUpdate: boolean;
    canUpdateAcc: boolean;
    canView: boolean;
    canDelete: boolean;
    canViewOrgUsers: boolean;
    currentPage: number;
    totalPages: number;
    loading: boolean;
    vendors: IVendor[];
}

const VendorTable = (props: Props) => {
    const { deleteVendor, getVendorsSort } = useVendorStore();
    const router = useRouter();

    const [pagination, setPagination] = useState({
        current: props.currentPage || 1,
        pageSize: 10,
    });

    // Handle page changes
    const onPageChange = (page: number) => {
        setPagination({ current: page, pageSize: pagination.pageSize });
        getVendorsSort(RecordStatus.Active, page); // Fetch vendors for the selected page
    };

    const onDelete = async (id: any) => {
        await deleteVendor(id).then(() => {
            getVendorsSort(RecordStatus.Active, pagination.current); // Refresh current page
        });
    };

    const onEdit = (id: number) => {
        router.push(vendorRoutes.edit + id);
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
                className="shadow-sm px-6"
                scroll={{ x: 700 }}
                dataSource={props.vendors}
                columns={VendorTableColumn({
                    canUpdate: props.canUpdate,
                    canUpdateAcc: props.canUpdateAcc,
                    canView: props.canView,
                    canDelete: props.canDelete,
                    canViewOrgUsers: props.canViewOrgUsers,
                    onEdit,
                    onDelete,
                })}
                pagination={false} // Disable default pagination
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
        </>
    );
};

export default VendorTable;
