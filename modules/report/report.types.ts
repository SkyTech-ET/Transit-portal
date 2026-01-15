import { RecordStatus } from "../common/common.types";

export interface IOrganizationReport {
    users: number;
    services: number;
    customers: number;
    documents: number;
}
export interface IOrganizationReportSort {
    fullName: string;
    phoneNumber: any;
    emailAddress: any,
    company: string,
    isInside: boolean,
    cateringType: string,
    numberOfGuests:number,
    additionalRequest:string,
    eventAddress:string,
    eventStartDate:Date,
    eventEndDate:Date,
    orderStatus:any,
    packageName:string
}
//export interface IOrganizationSortReport {
//     fullName: string;
//     phoneNumber: any;
//     emailAddress: any,
//     company: string,
//     isInside: boolean,
//     cateringType: string,
//     numberOfGuests:number,
//     additionalRequest:string,
//     eventAddress:string,
//     eventStartDate:Date,
//     eventEndDate:Date,
//     orderStatus:any,
//     packageName:string
// }
// export interface ISortReport {
//     logoPath: string;
//     organizationName: any;
//     approvedOrders: number,
//     numberOfOrders: number,
//     numberOfPackages: number,
//     numberOfUsers: number
// }
export interface AdminReportSort {
    logoPath: string;
    organizationName: any;
    approvedOrders: number,
    numberOfOrders: number,
    numberOfPackages: number,
    numberOfUsers: number
}
export interface AdminReport {
    users: number;
    services: number;
    customers: number;
    documents: number;
    messages: number;
    notifications: number;
    pendingApprovals: number;
}

export interface IReportPayload {
    startDate: string | null
    endDate: string | null
    organizationId: number | null
}

export interface IReportState {
    listLoading: boolean
    error: string | null;
    dashboard: any[]
    report: AdminReport | null;
    reportSort: AdminReportSort[];

    reportPerVendor: IOrganizationReport | null;
    reportPerOrderSort: IOrganizationReportSort [];
    reportSortOrder: IOrganizationReportSort[];

    reportPerOrganization: IOrganizationReport[]
    reportPerOrganizationSort: AdminReportSort[]
}

export interface IReportActions {
    getAllReport: (payload: IReportPayload) => Promise<any>;
    getReportsByOrg: (orgId:number) => Promise<any>;
    getAllReportSort: (payload: IReportPayload) => Promise<any>;
    getReportsByOrgSort: (orgId:number) => Promise<any>;
}

export type IReportStore = IReportState & IReportActions;
