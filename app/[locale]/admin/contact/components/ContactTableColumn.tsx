"use client";

import React from "react";
import { RecordStatusTag } from "../../components/common/CommonTag";

export const ContactTableColumn = () => [
  
    {
        title: "Contact Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
    },
    {
        title: "Phone Number",
        dataIndex: "phone",
        key: "phone",
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
    // {
    //     title: "Options",
    //     dataIndex: "operation",
    //     render: (_: any, record: any) => {
    //         return (<span className="flex gap-2">
    //             {
    //                 props.canUpdate &&
    //                 <Button
    //                     onClick={() => props.onEdit(record.id)}
    //                     type="primary"
    //                     className="bg-red"
    //                     icon={<PencilLine size={18} />}
    //                 ></Button>
    //             }
    //             {
    //                 props.canDelete &&
    //                 <Popconfirm title="Sure to delete?" onConfirm={async (e: any) => props.onDelete(record.id)}>
    //                     <Button className="bg-red" icon={<Trash size={18} color="red" />}
    //                     ></Button>
    //                 </Popconfirm>
    //             }
    //         </span >
    //         );
    //     }
    // },
];
