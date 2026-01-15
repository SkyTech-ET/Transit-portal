import { RecordStatus } from "../common/common.types";

export interface IContact {
  id: number;
  name: string;
  subject: string;
  phone: string;
  email: string;
  description: string;
  organizationId: number;

}

export interface IContactState {
  contacts: IContact[];
  loading: boolean;
  searchTerm: string;
  contactListLoading: boolean;
  showErrorNotification: boolean;
  showSuccessNotification: boolean;
  contact: IContact | null;
  error: string | null;
  filteredContacts: IContact[];
}

export interface IContactActions {
  addContact: (payload: IContact) => Promise<any>;
  getContacts: () => Promise<any>;
}

export type IContactStore = IContactState & IContactActions;
