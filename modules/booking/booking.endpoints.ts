import http from "@/modules/utils/axios/index";
import { RecordStatus } from "../common/common.types";
import { IBookingPayload } from "./booking.types";

const bookingEndpoints = Object.freeze({
    base: '/Bookings',
    delete: '/Bookings/Delete',
    getAll: "/Bookings/GetAll",
    create: "/Bookings/Create",
    update: "/Bookings/Update",
    getById: "/Bookings/GetById",
    getByOrgId: "/Bookings/GetByOrganizationId",
    updateStatus: "/Bookings/UpdateOrderStatus",
    //assignSubscription: "/Events/AssignSubscriptions",
});

// export const getBookings = (orgId: number, recordStatus: RecordStatus = RecordStatus.Active,pageNumber:number=1): Promise<Response> => {
//     return http.get({ url: `${bookingEndpoints.getByOrgId}/${orgId}`,params: { recordStatus:recordStatus,pageNumber:pageNumber } });
// };

export const getBooking = (id: number): Promise<Response> => {
    return http.get({ url: `${bookingEndpoints.getById}`, params: { id } });
};

export const addBooking = (payload: any): Promise<Response> => {
    return http.post({ url: bookingEndpoints.create, data: payload });
  };
  
  export const updateBooking = (payload: any, id: number): Promise<Response> => {
    return http.put({ url: `${bookingEndpoints.update}`, data: { ...payload, id: id } });
  };
  export const getBookingsByOrg = (orgId: number, recordStatus: RecordStatus = RecordStatus.Active,pageNumber:number=1): Promise<Response> => {
    return http.get({ url: `${bookingEndpoints.getByOrgId}/${orgId}`,params: { recordStatus:recordStatus,pageNumber:pageNumber } });
};



export const deleteBooking = (id: number): Promise<Response> => {
    return http.delete({ url: bookingEndpoints.delete, params: { id: id } });
};

export const updateBookingStatus = (payload: any): Promise<Response> => {
  return http.put({ url: `${bookingEndpoints.updateStatus}`, data: payload });
};