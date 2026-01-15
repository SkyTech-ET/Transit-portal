//import { ISubscription } from "../subscription";
import { RecordStatus } from "../common/common.types";

export interface ITag {
  id: number;
  name: string;
  description: string;
  recordStatus:   number;
}
export interface ITagPayload {
     
    id: number;
    name: string;
    description: string;
    recordStatus:   undefined;
}

export interface ITagState {
  loading: boolean;
  searchTerm: string;
  listLoading: boolean
  error: string | null;
  tags: ITag[];
  tag: ITag | null;
  filteredTags: ITag[]
}

export interface ITagActions {
  addTag: (payload: ITagPayload) => Promise<any>;

  updateTag: (payload: ITagPayload, id: number) => Promise<any>;
  deleteTag: (id: number) => Promise<any>;

  getTag: (id: number) => Promise<any>;
  getTags: (status: RecordStatus, searchTerm?: string) => Promise<any>;
}

export type TagStore = ITagState & ITagActions;
