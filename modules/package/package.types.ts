import { RecordStatus } from "../common/common.types";
import { IEvent, IService } from "../event";
export interface IPricingTiers {
    minPersons: number;
    maxPersons: number;
    pricePerPerson: number;


}
export interface IPackage {
    id: number;
    packageName: string;
    description: string;
    imagePath: string;
    recordStatus: number;
    eventId: number;
    organizationId: number;
    pricingTiers: IPricingTiers[];
    packageServiceRequest: IService[];
    eventList:IEvent[];
}
export interface IPackagePayload {
    id: number;
    packageName: string;
    description: string;
    imagePath: string;
    recordStatus: number;
    eventId: number;
    organizationId: number;
    userId: number;
    pricingTiers: IPricingTiers[];
    packageServiceRequest: IService[];
}
export interface IPackageState {
    loading: boolean;
    searchTerm: string;
    listLoading: boolean;
    error: string | null;
    packages: IPackage[];
    orgPackages: IPackage[];
    packageInd: IPackage | null;
    filteredPackages: IPackage[];
}
export interface IPackageActions {
    addPackage: (payload: FormData) => Promise<any>;
    updatePackage: (payload: FormData, id: number) => Promise<any>;
    deletePackage: (id: number) => Promise<any>;
    getPackagesByOrg: (id: number, status: RecordStatus) => Promise<any>;

    getPackage: (id: number) => Promise<any>;
    getPackages: (orgId: number, status: RecordStatus, searchTerm?: string) => Promise<any>;
}

export type PackageStore = IPackageState & IPackageActions;