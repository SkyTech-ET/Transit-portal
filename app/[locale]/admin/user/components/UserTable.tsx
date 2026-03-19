import React from "react";
import { Table, Button } from "antd";
import { IUser } from "@/modules/user/user.types";
import { UserTableColumn } from "./UserTableColumn";
import { useUserStore } from "@/modules/user/user.store";
import { RecordStatus } from "@/modules/common/common.types";
import { useRouter } from "next/navigation";
import { userRoutes } from "@/modules/user";
import type { GetProp, TableProps } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';

type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: SorterResult<any>['field'];
    sortOrder?: SorterResult<any>['order'];
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

interface Props {
    loading: boolean,
    canDelete: boolean,
    canUpdate: boolean,
    canReset: boolean,
    users: IUser[],
    currentPage: number,
    totalPages: number,
    searchTerm: string
}

const UserTable = (props: Props) => {
    const router = useRouter();
    const canReset = props.canReset;
    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate;
    const { deleteUser, getUsers } = useUserStore();
   
    // Pagination state
    const [pagination, setPagination] = React.useState({
        current: props.currentPage || 1,
        pageSize: 10,
    });

    // Handle page changes
    const onPageChange = (page: number, pageSize: number) => {
        setPagination({ current: page, pageSize });
        // No need to call API again since we have all data
    };

    // Calculate paginated data
    const getPaginatedUsers = () => {
        const startIndex = (pagination.current - 1) * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return props.users.slice(startIndex, endIndex);
    };

    const onDelete = async (id: any) => {
        deleteUser(id).then(() => {
            getUsers(RecordStatus.Active, props.currentPage, props.searchTerm || '');
        });
    };

    const onEdit = (id: number) => {
        router.push(userRoutes.edit + id);
    };

    const onReset = (id: number) => {
        router.push(userRoutes.resetPassword + id);
    };

    // Calculate total pages based on all users
    const totalPages = Math.ceil(props.users.length / pagination.pageSize);

    const onNext = () => {
        if (pagination.current < totalPages) {
            const nextPage = pagination.current + 1;
            onPageChange(nextPage, pagination.pageSize);
        }
    };

    const onPrevious = () => {
        if (pagination.current > 1) {
            const prevPage = pagination.current - 1;
            onPageChange(prevPage, pagination.pageSize);
        }
    };

    // Get page numbers to show in pagination
    const getPaginationPages = () => {
        const pagesToShow = [];
        let start = Math.max(1, pagination.current - 2);
        let end = Math.min(totalPages, pagination.current + 2);

        if (pagination.current > 3) pagesToShow.push(1);
        if (start > 2) pagesToShow.push("...");

        for (let i = start; i <= end; i++) {
            pagesToShow.push(i);
        }

        if (end < totalPages - 1) pagesToShow.push("...");
        if (end < totalPages) pagesToShow.push(totalPages);

        return pagesToShow;
    };

    return (
        <div>
            <Table
                id="id"
                size="small"
                loading={props.loading}
                dataSource={getPaginatedUsers()}
                scroll={{ x: 700 }}
                columns={UserTableColumn({ canDelete, canUpdate, canReset, onDelete, onEdit, onReset })}
                pagination={false}
                locale={{
                    emptyText: (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', color: '#999', marginBottom: '8px' }}>
                                No users found
                            </div>
                            <div style={{ fontSize: '14px', color: '#ccc' }}>
                                {props.loading ? 'Loading users...' : 'No users have been created yet.'}
                            </div>
                        </div>
                    )
                }}
            />

            {/* Custom Pagination Controls */}
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Button
                    onClick={onPrevious}
                    disabled={pagination.current === 1}
                    style={{ marginRight: 8 }}
                >
                    Previous
                </Button>

                {/* Render page numbers with ellipses */}
                {getPaginationPages().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === "..." ? (
                            <span style={{ margin: "0 5px" }}>...</span>
                        ) : (
                            <Button
                                type={pagination.current === page ? "primary" : "default"}
                                onClick={() => onPageChange(page as number, pagination.pageSize)}
                                style={{ margin: "0 5px" }}
                            >
                                {page}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                <Button
                    onClick={onNext}
                    disabled={pagination.current === totalPages}
                    style={{ marginLeft: 8 }}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default UserTable;
