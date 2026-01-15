import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { IOrganizationReportSort } from "@/modules/report";
import { ReportPerOrderTableColumn } from "./ReportPerOrderTableColumn";

interface Props {
    loading: boolean;
    canView: boolean;
    reports: IOrganizationReportSort[];
}

const ReportPerOrderTable = ({ loading, canView, reports }: Props) => {
    return (
        <Table
            id="organization-report-table"
            size="small"
            loading={loading}
            dataSource={reports}
            className="shadow-sm bg-white border rounded-md border-slate-50"
            scroll={{ x: 700 }}
            columns={ReportPerOrderTableColumn({ canView }) as ColumnsType<IOrganizationReportSort>}
        />
    );
};

export default ReportPerOrderTable;
