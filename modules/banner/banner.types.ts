//import { ISubscription } from "../subscription";
import { RecordStatus } from "../common/common.types";

export interface IBanner {
  id: number;
  BannerTitle:    string;
  description:    string;
  imagePath:      string;
  BannerType:     string;
  recordStatus:   number;
  organizationId: number;
}

export interface IBannerPayload {
  id: number;
  BannerTitle:      string;
  description:    string;
  imagePath:      string;
  BannerType:       string;
  recordStatus:   undefined;
  organizationId: number;
}

export interface IBannerState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  banners: IBanner[];
  banner: IBanner | null;
  filteredBanners: IBanner[];
}

export interface IBannerActions {
  addBanner: (payload: FormData) => Promise<any>;

  updateBanner: (payload: FormData, id: number) => Promise<any>;
  deleteBanner: (id: number) => Promise<any>;

  getBanner: (id: number) => Promise<any>;
  getBanners: (orgId:number,status: RecordStatus, searchTerm?: string) => Promise<any>;
   // New function for fetching services
  // getServices: (orgId: number, status?: RecordStatus) => Promise<any>;
}

export type BannerStore = IBannerState & IBannerActions;
