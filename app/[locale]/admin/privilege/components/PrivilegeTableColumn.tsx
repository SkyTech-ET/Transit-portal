"use client";

import React from "react";
import { Button, Popconfirm } from "antd";
import { PencilLine, Trash } from "lucide-react";

interface Props {
    canDelete: boolean
    canUpdate: boolean,
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

export const PrivilegeTableColumn = (props: Props) => [
    {
        title: "Action",
        dataIndex: "action",
        key: "action",
    },
    {
        title: "Description",
        dataIndex: "description",
        key: "description",
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
            </span>
            );
        }
    },
];
