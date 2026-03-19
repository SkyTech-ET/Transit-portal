"use client";

import { Table } from "antd";
import { useRouter } from "next/navigation";
import { tagRoutes } from "@/modules/tag";
import { ITag } from "@/modules/tag/tag.types";
import { TagTableColumn } from "./tagTableColumn";
import { useTagStore } from "@/modules/tag/tag.store";
import { RecordStatus } from "@/modules/common/common.types";

interface Props {
    loading: boolean,
    canDelete: boolean,
    canUpdate: boolean,
    canView: boolean,
    tags: ITag[]
}

const TagTable = (props: Props) => {
    const router = useRouter()
    const { deleteTag, getTags } = useTagStore()

    const canDelete = props.canDelete;
    const canUpdate = props.canUpdate

    const onDelete = async (id: any) => {
        await deleteTag(id).then((res: any) => {
            getTags(RecordStatus.Active)
        })
    }
    const onEdit = (id: number) => {
        router.push(tagRoutes.edit + id)
    }

    return (<>
        <Table
            id="id"
            size="small"
            loading={props.loading}
            dataSource={props.tags}
            className="shadow-sm px-6"
            scroll={{ x: 700 }}
            columns={TagTableColumn({ canUpdate, canDelete, onDelete, onEdit })}
            pagination={{
                position: ["bottomLeft"],
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '30', '50', '100'],
            }}
        />
    </>)
}

export default TagTable;