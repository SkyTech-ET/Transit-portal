"use client";

import React from "react";
import Link from "next/link";
import { EnvironmentOutlined } from "@ant-design/icons"; 
import {Avatar, Popover,Button, Popconfirm } from "antd";
import { Building, MapPin, PencilLine, Trash } from "lucide-react";
import VendorTableAction from "./VendorTableAction";
import { AccountStatusTag, NumberParserTag, RecordStatusTag, RequestStatusTag } from "../../components/common/CommonTag";
import { vendorRoutes } from "@/modules/vendor/vendor.routes";
import { parseImage } from "@/modules/utils";
import { IVendor } from "@/modules/vendor/vendor.types";
interface Props {
    canUpdate: boolean,
    canUpdateAcc: boolean,
    canView: boolean,
    canDelete: boolean
    canViewOrgUsers: boolean

    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export const VendorTableColumn = (props: Props) => [
  {
    title: "Vendor",
    dataIndex: "logoPath",
    key: "logoPath",
    render: (_: any, record: IVendor) => {
      // Popover content with additional details
      const content = (
        <div>
          <p>
          <strong>City:</strong> {record.city || "N/A"}
          </p>
          <p>
            <strong>State:</strong> {record.state ? "Yes" : "No"}
          </p>
          <p>
            <strong>Description:</strong>{" "} {record.description || "N/A"}
          </p>
          <p>
            <strong>Email Address:</strong>{" "} {record.managerialEmailAddress|| "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {record.address|| "N/A"}
          </p>
        </div>
      );

      return (
        <Popover content={content} title="Vendor Details" trigger="click">
          <Link
            href={ "#"}
          >
            <div className="py-3 sm:py-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {record.logoPath ? (
                    <img
                      src={parseImage(record.logoPath)}
                      alt={`Logo`}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <Avatar icon={<Building />} />
                  )}
                </div>
                <div className="flex-1 min-w-0 ms-2">
                  <p className="text-lg font-medium pb-1 text-gray-900 truncate">
                    {record.organizationName || "Organization Name"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                  <EnvironmentOutlined style={{ marginRight: 5, color: "#808080" }} />
                  {record.address|| "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </Popover>
      );
    },
  },
      {
        title: "Total Approved Orders",
        dataIndex: "approvedOrders",
        key: "approvedOrders",
        render: (_: any, record: IVendor) => (
          <NumberParserTag value={record.approvedOrders || 0} color="green" />
        ),
    
      },
    
      {
        title: "Total Orders",
        dataIndex: "numberOfOrders",
        key: "numberOfOrders",
        render: (_: any, record: IVendor) => (
          <NumberParserTag value={record.numberOfOrders || 0} color="pink" />
        ),
      },
      {
        title: "Total Packages",
        dataIndex: "numberOfPackages",
        key: "numberOfPackages",
        render: (_: any, record: IVendor) => (
          <NumberParserTag value={record.numberOfPackages || 0} color="purple" />
        ),
      },
      {
        title: "Total Users",
        dataIndex: "numberOfUsers",
        key: "numberOfUsers",
        render: (_: any, record: IVendor) => (
          <NumberParserTag value={record.numberOfUsers || 0} color="cyan" />
        ),
      },


    {
        title: "Account Status",
        dataIndex: "accountStatus",
        key: "accountStatus",
        render: (_: any, record: any) => <AccountStatusTag status={record.accountStatus} />,
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
                        <Button
                            className="bg-red"
                            icon={<Trash size={18} color="red" />}
                        ></Button>
                    </Popconfirm>
                }

                <VendorTableAction
                    vendor={record}
                    canUpdateAcc={props.canUpdateAcc}
                    canView={props.canView}
                    canViewOrgUsers={props.canViewOrgUsers}
                />
            </span>
            );
        }
    },
];
