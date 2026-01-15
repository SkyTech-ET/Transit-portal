"use client";

import React from "react";
import Link from "next/link";
import { Avatar } from "antd";
import { Building } from "lucide-react";
import { ColumnsType } from "antd/es/table";
import { formatDateHRF, parseImage } from "@/modules/utils";
import { AdminReportSort } from "@/modules/report";
import { AmountParserTag, CurrencyParserTag, NumberParserTag } from "../../components/common/CommonTag";

interface Props {
  canView: boolean;
}

export const ReportPerOrgTableColumn = (props: Props): ColumnsType<AdminReportSort> => [

  {
    title: "Customer",
    dataIndex: "logoPath",
    key: "logoPath",
    render: (_: any, record: AdminReportSort) => (
      <Link href={props.canView ? `/organization/${record.organizationName}` : "#"}>
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
                {record.organizationName || "Customer Name"}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {"Address here"}
              </p>
            </div>
          </div>
        </div>
      </Link>

    ),
  },
  {
    title: "Total Approved Services",
    dataIndex: "approvedOrders",
    key: "approvedOrders",
    render: (_: any, record: AdminReportSort) => (
      <NumberParserTag value={record.approvedOrders || 0} color="green" />
    ),

  },

  {
    title: "Total Services",
    dataIndex: "numberOfOrders",
    key: "numberOfOrders",
    render: (_: any, record: AdminReportSort) => (
      <NumberParserTag value={record.numberOfOrders || 0} color="pink" />
    ),
  },
  {
    title: "Total Documents",
    dataIndex: "numberOfPackages",
    key: "numberOfPackages",
    render: (_: any, record: AdminReportSort) => (
      <NumberParserTag value={record.numberOfPackages || 0} color="purple" />
    ),
  },
  {
    title: "Total Users",
    dataIndex: "numberOfUsers",
    key: "numberOfUsers",
    render: (_: any, record: AdminReportSort) => (
      <NumberParserTag value={record.numberOfUsers || 0} color="cyan" />
    ),
  },
];
