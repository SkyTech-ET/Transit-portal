"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Modal, Popconfirm } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons"; // Ant Design icon example
import { PencilLine, Trash, MapPin } from "lucide-react";
import { CurrencyParserTag, NumberParserTag } from "../../components/common/CommonTag";
import {
  AccountStatusTag,
  RequestStatusTag,
} from "../../components/common/CommonTag";
import SubscriptionTableAction from "./SubscriptionTableAction";

interface Props {
  canUpdateReq: boolean;
  canUpdateAcc: boolean;
  onEditAcc: (id: number) => void;
  onEditReq: (id: number) => void;
}

export const SubscriptionTableColumn = (props: Props) => {
  const router = useRouter();

  return [
    {
      title: "Vendor",
      dataIndex: "organization",
      key: "orgDetails",
      render: (item: any) => {
        return (
          <div>
          <p>{item.orgName}</p>
          <p style={{ fontWeight: "lighter" }}>
          <EnvironmentOutlined style={{ marginRight: 5, color: "#808080" }} />
            {item.orgAddress}
          </p>
        </div>
        );
      },
    },
    {
      title: "Plan",
      dataIndex: "subscription",
      key: "planName",
      render: (item: any) => {
        return <p>{item.planName}</p>;
      },
    },
    {
      title: "Price",
      dataIndex: "subscription",
      key: "price",
      render: (item: any) => {
        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <CurrencyParserTag currency={item.price || 0}/>
          </div>
        );
      },
    },
    

    {
      title: "Start Date",
      dataIndex: "subscription",
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
      dataIndex: "subscription",
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
      dataIndex: "subscription",
      key: "requestStatus",
      render: (_: any, record: any) => (
        <RequestStatusTag status={record.subscription.requestStatus} />
      ),
    },
    // {
    //   title: "Account Status",
    //   dataIndex: "subscription",
    //   key: "accountStatus",
    //   render: (_: any, record: any) => (
    //     <AccountStatusTag status={record.subscription.accountStatus} />
    //   ),
    // },

    {
      title: "Options",
      dataIndex: "operation",
      render: (_: any, record: any) => {
        return (
          <span className="flex gap-2">
            <SubscriptionTableAction
              subscription={record.subscription}
              canUpdateAcc={props.canUpdateAcc}
              canUpdateReq={props.canUpdateReq}
            />
          </span>
        );
      },
    },
  ];
};
