import http from "@/modules/utils/axios";
import { IContact } from "./contact.types";
import { RecordStatus } from "../common/common.types";

const contactEndpoints = Object.freeze({
  createContact: "/ContactUs/Create",
  getAll: "/ContactUs/GetAll"
});

export const addContact = (payload: any): Promise<IContact> => {
  return http.post({ url: contactEndpoints.createContact, data: payload });
};
export const getContacts = ( ): Promise<Response> => {
  return http.get({ url: `${contactEndpoints.getAll}` });
};