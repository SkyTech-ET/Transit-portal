export enum RecordStatus {
    InActive = 1,
    Active = 2,
    Delete = 3,
}
export enum RequestStatus {
    Pending = 1,
    Approved = 2,
    Rejected = 3
}
export enum AccountStatus {
    InActive = 1,
    Active = 2,
    Pending = 3,
    Suspended = 4
}
export enum OrderStatus {
    Pending = 1,
    Approved = 2,
    InProgress = 3,
    Completed = 4,
    Cancelled = 5
}
export enum PaymentStatus {
    Pending = 1,
    Paid = 2,
    Failed = 3,
    Cancelled = 4,
    UnPaid = 5
}
export interface IAccountStatus{
    id: number,
    accountStatus: number
  }
  export interface IRequestStatus{
    id: number,
    requestStatus: number
  }
export enum PaymentOptions {
    Online = 1,
    Cash = 2
}

export const recordStatusCodes: Record<string, number> = {
    Pending: RecordStatus.Active,
    Processing: RecordStatus.InActive,
    Completed: RecordStatus.Delete,
};
