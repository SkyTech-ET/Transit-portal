"use client";

import React from "react";
import { ColumnsType } from "antd/es/table";
import { IOrganizationReportSort } from "@/modules/report";
import { NumberParserTag, OrderStatusTag, EmailParserTag } from "../../components/common/CommonTag";
import dayjs from "dayjs";
import { OrderStatus } from "@/modules/common/common.types";
import { dateFormatterWithHours } from "@/modules/utils/formatter";

interface Props {
    canView: boolean;
}

export const ReportPerOrderTableColumn = ({ canView }: Props): ColumnsType<IOrganizationReportSort> => [
    {
        title: "Full Name",
        dataIndex: "fullName",
        key: "fullName",
        render: (value: string) => <span style={{ color: "Black" }}>{value || "N/A"}</span>,
    },
    {
        title: "Phone",
        dataIndex: "phoneNumber",
        key: "phoneNumber",
        render: (value: string) => <span style={{ color: "Black" }}>{value || "N/A"}</span>,
    },
    {
        title: "Email",
        dataIndex: "emailAddress",
        key: "emailAddress",
        render: (value: string) =>
            value ? (
                <EmailParserTag email={value} subject="Hello!" body="This is a sample email body." />
            ) : (
                <span>N/A</span>
            ),
    },
    
    {
        title: "Event Address",
        dataIndex: "eventAddress",
        key: "eventAddress",
        render: (value: string) => <span style={{ color: "Black" }}>{value || "N/A"}</span>,
    },
    {
        title: "No of Gusts",
        dataIndex: "numberOfGuests",
        key: "numberOfGuests",
        render: (value: string) => <NumberParserTag value={value || 0} color="Gray" />,
    },
    {
        title: "Catering Type",
        dataIndex: "cateringType",
        key: "cateringType",
        render: (value: string) => <span style={{ color: "Black" }}>{value || "N/A"}</span>,
    },
    {
        title: "Start Date",
        dataIndex: "eventStartDate",
        key: "eventStartDate",
        render: (value: string) =>
            value ? (
                <span>{dateFormatterWithHours(value)}</span> // Display formatted date with hours
            ) : (
                <span>N/A</span>
            ),
    },
    {
        title: "End Date",
        dataIndex: "eventEndDate",
        key: "eventEndDate",
        render: (value: string) =>
            value ? (
                <span>{dateFormatterWithHours(value)}</span> // Display formatted date with hours
            ) : (
                <span>N/A</span>
            ),
    },
    
    
    {
        title: "Status",
        dataIndex: "orderStatus",
        key: "orderStatus",
        render: (value: OrderStatus) => <OrderStatusTag status={value} />,
    },
];
