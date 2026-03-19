"use client";

import React from "react";
import { Button, Popconfirm } from "antd";
import { PencilLine, Trash } from "lucide-react";
import { RecordStatusTag } from "../../components/common/CommonTag";
import { parseImage } from "@/modules/utils";

interface Props {
    canDelete: boolean
    canUpdate: boolean,
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const BannerTableColumn = (props: Props) => [
    {
        title: "Banner Image",
        dataIndex: "imagePath",
        key: "imagePath",
        render: (imagePath: string) => (
            <img src={parseImage(imagePath)} alt="Banner" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        ),
    },
    {
        title: "Banner Title",
        dataIndex: "bannerTitle",
        key: "bannerTitle",
    },
    {
        title: "Banner Type",
        dataIndex: "bannerType",
        key: "bannerType",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
    },
 
    {
        title: "Status",
        dataIndex: "recordStatus",
        key: "recordStatus",
        render: (_: any, record: any) => <RecordStatusTag status={record.recordStatus} />,
    },
    {
        title: "Options",
        dataIndex: "operation",
        render: (_: any, record: any) => {
            return (<span className="flex gap-2">
                {
                    props.canUpdate &&
                    <Button
                        onClick={() => props.onEdit(record.id)}
                        type="primary"
                        className="bg-red"
                        icon={<PencilLine size={18} />}
                    ></Button>
                }
                {
                    props.canDelete &&
                    <Popconfirm title="Sure to delete?" onConfirm={async (e: any) => props.onDelete(record.id)}>
                        <Button className="bg-red" icon={<Trash size={18} color="red" />}
                        ></Button>
                    </Popconfirm>
                }
            </span >
            );
        }
    },
];
