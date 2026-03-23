"use client";

import React from "react";
import Link from "next/link";
import { AdminReportSort } from "@/modules/report";
import { formatDateHRF, parseImage } from "@/modules/utils";
import { Avatar } from "antd";
import { ColumnsType } from "antd/es/table";
import { Building } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AmountParserTag,
  CurrencyParserTag,
  NumberParserTag,
} from "../../components/common/CommonTag";

interface Props {
  canView: boolean;
}

export const ReportPerOrgTableColumn = (
  props: Props
): ColumnsType<AdminReportSort> => {
  const t = useTranslations("AdminSidebar");

  return [
    {
      title: t("customermanagment"),
      dataIndex: "logoPath",
      key: "logoPath",
      render: (_: any, record: AdminReportSort) => (
        <Link
          href={
            props.canView ? `/organization/${record.organizationName}` : "#"
          }
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
              <div className="ms-2 min-w-0 flex-1">
                <p className="truncate pb-1 text-lg font-medium text-gray-900">
                  {record.organizationName || t("customermanagment")}
                </p>
                <p className="truncate text-sm text-gray-500">
                  {"Address here"}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ),
    },
    {
      title: t("approvedservices"),
      dataIndex: "approvedOrders",
      key: "approvedOrders",
      render: (_: any, record: AdminReportSort) => (
        <NumberParserTag value={record.approvedOrders || 0} color="green" />
      ),
    },

    {
      title: t("totalorders"),
      dataIndex: "numberOfOrders",
      key: "numberOfOrders",
      render: (_: any, record: AdminReportSort) => (
        <NumberParserTag value={record.numberOfOrders || 0} color="pink" />
      ),
    },
    {
      title: t("totaldocuments"),
      dataIndex: "numberOfPackages",
      key: "numberOfPackages",
      render: (_: any, record: AdminReportSort) => (
        <NumberParserTag value={record.numberOfPackages || 0} color="purple" />
      ),
    },
    {
      title: t("systemusers"),
      dataIndex: "numberOfUsers",
      key: "numberOfUsers",
      render: (_: any, record: AdminReportSort) => (
        <NumberParserTag value={record.numberOfUsers || 0} color="cyan" />
      ),
    },
  ];
};
