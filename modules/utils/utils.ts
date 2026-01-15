import { RecordStatus } from "../common/common.types";
import { formatDate } from "./formatter";

const getDefaultFilter = () => {
    const now = new Date();
    const endDate = formatDate(now)
    const startDate = formatDate(now.setDate(now.getDate() - 30))

    let filterPayload = { startDate: startDate, endDate: endDate, organizationId: null,eventId :null, recordStatus: RecordStatus.Active }
    return filterPayload;
}





const checkFieldValue = (obj: any, fieldName: any) => {
    return obj.hasOwnProperty(fieldName) && !!obj[fieldName]
};

const formatFieldName = (fieldName: string) => {
    return fieldName.replace(/([A-Z])/g, ' $1').trim();
};

const parseImage = (path: string) => {
    return "http://api.transit.com/"+path;
};      


export { getDefaultFilter, formatFieldName, checkFieldValue,parseImage }