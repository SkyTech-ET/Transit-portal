"use client";

import React from "react";
import { Button, Popconfirm, Tooltip } from "antd";
import { PencilLine, Trash } from "lucide-react";
import { RecordStatusTag } from "../../components/common/CommonTag";
import { parseImage } from "@/modules/utils";

interface Props {
    canDelete: boolean
    canUpdate: boolean,
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const PackageTableColumn = (props: Props) => [
    {
        title: "Package Image",
        dataIndex: "imagePath",
        key: "imagePath",
        render: (imagePath: string, record: any) => (
            <Tooltip
                // title={
                //     <div>
                //         {record.services.map((service: { id: number; serviceName: string }) => (
                //             <div key={service.id}>{service.serviceName}</div>
                //         ))}
                //     </div>
                // }
            >
                <img
                    src={parseImage(imagePath)}
                    alt="Package"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
            </Tooltip>
        ),
    },
    {
        title: "Package Name",
        dataIndex: "packageName",
        key: "packageName",
        render: (packageName: string, record: any) => (
             <Tooltip
            //     title={
            //         <div>
            //             {record.services.map((service: { id: number; serviceName: string }) => (
            //                 <div key={service.id}>{service.serviceName}</div>
            //             ))}
            //         </div>
            //     }
             >
                <span>{packageName}</span>
            </Tooltip>
        ),
    },
    {
        title: "Pricing Tiers",
        dataIndex: "pricingTiers",
        key: "pricingTiers",
        render: (pricingTiers: { minPersons?: number; maxPersons?: number; pricePerPerson?: number }) => {
            console.log(pricingTiers); // Check the structure
            if (pricingTiers && pricingTiers.minPersons !== undefined && pricingTiers.maxPersons !== undefined && pricingTiers.pricePerPerson !== undefined) {
                return `${pricingTiers.minPersons}-${pricingTiers.maxPersons} persons: $${pricingTiers.pricePerPerson} per person`;
            }
            return "N/A";
         
        },
    },
    
    //     {
    //     title: "Services",
    //     dataIndex: "services", // Assuming your event data includes services
    //     key: "services",
    //     render: (services: { id: number; serviceName: string }[]) => (
    //         <div>
    //             {services.map(service => (
    //                 <div key={service.id}>{service.serviceName}</div>
    //             ))}
    //         </div>
    //     ),
    // },
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
