"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { subscriptionPackageRoutes } from "@/modules/subscriptionPackages";
import { ISubscriptionPackage } from "@/modules/subscriptionPackages/subscriptionPackages.types";
import { SubscriptionPackageTableColumn } from "./SubscriptionPackageTableColumn";
import { useSubscriptionPackagesStore } from "@/modules/subscriptionPackages/subscriptionPackages.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean,
    canDelete: boolean,
    canUpdate: boolean,
    canView: boolean,
    subscriptionPackages: ISubscriptionPackage[]
}

const SubscriptionPackageTable = (props: Props) => {
    const router = useRouter()
    const { getSubscriptionPackages,deleteSubscriptionPackage } = useSubscriptionPackagesStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteSubscriptionPackage(id).then((res: any) => {
            getSubscriptionPackages(RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(subscriptionPackageRoutes.edit + id)
    }
    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.subscriptionPackages}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={SubscriptionPackageTableColumn({ canUpdate, canDelete,onDelete,  onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default SubscriptionPackageTable;