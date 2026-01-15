"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Popconfirm } from "antd";
import { usePermissionStore } from '@/modules/utils';
import { EnvironmentOutlined } from "@ant-design/icons"; // Ant Design icon example
import { PencilLine, Trash, MapPin } from "lucide-react";
import { CurrencyParserTag, NumberParserTag } from "../../components/common/CommonTag";
import {
  AccountStatusTag,
  RequestStatusTag,
} from "../../components/common/CommonTag";
import VendorSubscriptionTableAction from "./vendorSubscriptionTableAction";

interface Props {
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number, organizationId:number) => void;
}

export const VendorSubscriptionTableColumn = (props: Props) => {
  const router = useRouter();
  const { currentUser } = usePermissionStore();
  return [
    {
      title: "Plan",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    

    {
      title: "Start Date",
      dataIndex: "effectiveDateFrom",
      key: "effectiveDateFrom",
      render: (item: any) => {
        const date = new Date(item.effectiveDateFrom);
        return item.effectiveDateFrom === "0001-01-01T00:00:00" ||
          isNaN(date.getTime())
          ? "N/A"
          : date.toLocaleDateString();
      },
    },
    {
      title: "End Date",
      dataIndex: "effectiveDateTo",
      key: "effectiveDateTo",
      render: (item: any) => {
        const date = new Date(item.effectiveDateTo);
        return item.effectiveDateTo === "0001-01-01T00:00:00" ||
          isNaN(date.getTime())
          ? "N/A"
          : date.toLocaleDateString();
      },
    },

    {
      title: "Subscription Status",
      dataIndex: "requestStatus",
      key: "requestStatus",
      render: (_: any, record: any) => (
        <RequestStatusTag status={record.requestStatus} />
      ),
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (_: any, record: any) => (
        <AccountStatusTag status={record.accountStatus} />
      ),
    },

    {
      title: "Options",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        const organizationId = currentUser?.organization?.id as number;
        if (record.requestStatus === 1) {
          // Display options only when requestStatus is Pending
          return (
            <span className="flex gap-2">
              {props.canUpdate && (
                <Button
                  onClick={() => props.onEdit(record.id)}
                  type="primary"
                  className="bg-red"
                  icon={<PencilLine size={18} />}
                ></Button>
              )}
              {props.canDelete && (
                <Popconfirm
                  title="Sure to delete?"
                  onConfirm={async (e: any) => props.onDelete(record.id, organizationId)}
                >
                  <Button
                    className="bg-red"
                    icon={<Trash size={18} color="red" />}
                  ></Button>
                </Popconfirm>
              )}
            </span>
          );
        }
        return null; 
      },
    },
    
  ];
};
