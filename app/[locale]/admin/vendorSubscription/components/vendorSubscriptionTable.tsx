"use client";

import React, { useState } from "react";
import { Table, Button } from "antd";
import { useRouter } from "next/navigation";
import { vendorSubscriptionRoutes } from "@/modules/vendorSubscription";
import { IVendorSubscriptionTableRow } from "@/modules/vendorSubscription/vendorSubscription.types";
import { VendorSubscriptionTableColumn } from "./vendorSubscriptionTableColumn";
import { useVendorSubscriptionStore } from "@/modules/vendorSubscription/vendorSubscription.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean;
   // canUpdateReq: boolean;
    //canUpdateAcc: boolean;
    canView: boolean;
    canViewOrgVendorSubscriptions: boolean;
    vendorSubscriptions: IVendorSubscriptionTableRow[];
    currentPage: number;
    totalPages: number;
    searchTerm: string;
    orgId: any;
    canDelete: boolean
    canUpdate: boolean,
}

const VendorSubscriptionTable = (props: Props) => {
    const router = useRouter()
    const { deleteVendorSubscription, getVendorSubscriptions } = useVendorSubscriptionStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any, organizationId: any) => {
        await deleteVendorSubscription(id, organizationId).then((res: any) => {
            getVendorSubscriptions(props.orgId, RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(vendorSubscriptionRoutes.edit + id)
    }

    return ( <>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.vendorSubscriptions}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={VendorSubscriptionTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </> )
}


export default VendorSubscriptionTable;
