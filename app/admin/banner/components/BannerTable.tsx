"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { IBanner } from "@/modules/banner/banner.types";
import { BannerTableColumn } from "./BannerTableColumn";
import { useBannerStore } from "@/modules/banner/banner.store";
import { RecordStatus } from "@/modules/common/common.types";
import { bannerRoutes} from "@/modules/banner";

interface Props {
    loading: boolean,
    canDelete: boolean
    canUpdate: boolean,
    banners: IBanner[]
}

const BannerTable = (props: Props) => {
    const router = useRouter()
    const { deleteBanner, getBanners } = useBannerStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteBanner(id).then((res: any) => {
            getBanners(RecordStatus.Active, RecordStatus.Active )
        })
    }
    const onEdit = (id: number) => {
        router.push(bannerRoutes.edit + id)
    }
    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.banners}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={BannerTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default BannerTable;