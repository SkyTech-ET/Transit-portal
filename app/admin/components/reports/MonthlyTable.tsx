import { Table } from "antd";
import { MonthlyReport } from "@/modules/report/report.types";

export default function MonthlyTable({ data }: { data: MonthlyReport[] }) {
  return (
    <Table
      rowKey={(r) => `${r.year}-${r.month}`}
      pagination={false}
      dataSource={data}
      columns={[
        { title: "Month", render: (_, r) => `${r.month}/${r.year}` },
        { title: "Total Services", dataIndex: "totalServices" },
        { title: "Completed", dataIndex: "completedServices" },
        { title: "In Progress", dataIndex: "inProgressServices" },
        { title: "Rejected", dataIndex: "rejectedServices" },
        {
          title: "Completion Rate",
          render: (_, r) => `${r.completionRate}%`,
        },
      ]}
    />
  );
}
