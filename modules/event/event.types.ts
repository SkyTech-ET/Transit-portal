//import { ISubscription } from "../subscription";
import { RecordStatus } from "../common/common.types";

export interface IEvent {
  id: number;
  eventName:      string;
  description:    string;
  imagePath:      string;
  recordStatus:   number;
}

export interface IService {
  id: number;
  serviceName: string;
  description: string;
  price: number;
  rating: number;
  dataIndex: string; 
  recordStatus:  undefined;
}

export interface IEventPayload {
  id: number;
    eventName:      string;
    description:    string;
    imagePath: string;
    recordStatus:  undefined;
}

export interface IEventState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  events: IEvent[];
  event: IEvent | null;
  filteredEvents: IEvent[];
 // services: IService[]; // Update this to use the IService type
}

export interface IEventActions {
  addEvent: (payload: FormData) => Promise<any>;

  updateEvent: (payload: FormData, id: number) => Promise<any>;
  deleteEvent: (id: number) => Promise<any>;

  getEvent: (id: number) => Promise<any>;
  getEvents: (status: RecordStatus, searchTerm?: string) => Promise<any>;
   // New function for fetching services
   //getServices: (orgId: number, status?: RecordStatus) => Promise<any>;
}

export type EventStore = IEventState & IEventActions;
