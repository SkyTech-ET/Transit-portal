//import { ISubscription } from "../subscription";
import { RecordStatus, OrderStatus } from "../common/common.types";

export interface IBooking {
  id: number;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  company: string;
  isInside: boolean;
  cateringType:string;
  numberOfGuests: number;
  additionalRequest: string;
  eventAddress: string;
  eventStartDate: Date;
  eventEndDate: Date;
  recordStatus:   number;
  packageId: number;
}

export interface IBookingStatus {
  id: number;
  orderStatus:number;

}
export interface IBookingBase {
  id: number;
  orderStatus:number;

}
export interface IBookingStatusPayload {
  id: number;
  orderStatus:number;
}

export interface IBookingPayload {
     
    id: number;
    fullName: string;
    phoneNumber: string;
    emailAddress: string;
    company: string;
    isInside: boolean;
    cateringType:string;
    numberOfGuests: number;
    additionalRequest: string;
    eventAddress: string;
    eventStartDate: Date;
    eventEndDate: Date;
    recordStatus:   number;
    orderStatus:   number;
    packageId: number;
    currentPage: number;
    totalPages: number;
}

export interface IBookingState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  success: boolean
  error: string | null;
  bookings: IBooking[];
  orgBookings: IBooking[];
  booking: IBooking | null;
  filteredBookings: IBooking[]
  currentPage: number;
  totalPages: number;
 // invoiceColumns: any[]
}

export interface IBookingActions {
  addBooking: (payload: IBookingPayload) => Promise<any>;

  updateBooking: (payload: IBookingPayload, id: number) => Promise<any>;
  deleteBooking: (id: number) => Promise<any>;
  getBookingsByOrg: (orgId:number,status: RecordStatus,pageNumber?: number, searchTerm?: string) => Promise<any>;
 
  getBooking: (id: number) => Promise<any>;
  //getBookings: (orgId:number,status: RecordStatus,pageNumber?: number, searchTerm?: string) => Promise<any>;
  updateBookingStatus: (payload: IBookingStatusPayload, id: number) => Promise<any>;
}

export type BookingStore = IBookingState & IBookingActions;
