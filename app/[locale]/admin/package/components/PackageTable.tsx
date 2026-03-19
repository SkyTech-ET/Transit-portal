"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { IPackage } from "@/modules/package/package.types";
import { PackageTableColumn } from "./PackageTableColumn";
import { usePackageStore } from "@/modules/package/package.store";
import { RecordStatus } from "@/modules/common/common.types";
import { packageRoutes} from "@/modules/package";

interface Props {
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    packages: IPackage[]
}

const PackageTable = (props: Props) => {
    const router = useRouter()
    const { deletePackage, getPackages } = usePackageStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deletePackage(id).then((res: any) => {
            getPackages(RecordStatus.Active, RecordStatus.Active )
        })
    }
    const onEdit = (id: number) => {
        router.push(packageRoutes.edit + id)
    }
    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.packages}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={PackageTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default PackageTable;