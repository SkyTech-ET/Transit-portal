import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { AdminReportSort } from "@/modules/report";
import { ReportPerOrgTableColumn } from "./ReportPerOrgTableColumn";

interface Props {
    loading: boolean;
    canView: boolean;
    reports: AdminReportSort[];
}

const ReportPerOrganizationTable = ({ loading, canView, reports }: Props) => {
    return (
        <Table
            id="organization-report-table"
            size="small"
            loading={loading}
            dataSource={reports}
            className="shadow-sm bg-white border rounded-md border-slate-50"
            scroll={{ x: 700 }}
            columns={ReportPerOrgTableColumn({ canView }) as ColumnsType<AdminReportSort>}
        />
    );
};

export default ReportPerOrganizationTable;
