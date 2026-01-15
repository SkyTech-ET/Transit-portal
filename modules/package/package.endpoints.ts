import http from "@/modules/utils/axios/index"
import { RecordStatus } from "../common/common.types"

const packageEndpoints=Object.freeze({
    base: '/Packages',
    delete: '/Packages/Delete',
    getAll: '/Packages/GetAll',
    create:'/Packages/Create',
    update: '/Packages/Update',
    getById: '/Packages/GetById',
    getByOrgId: '/Packages/GetByOrganizationId'
});

export const getPackages=(orgId: number, recordStatus: RecordStatus=RecordStatus.Active):Promise<Response>=>{
    return http.get({url:`${packageEndpoints.getByOrgId}/${orgId}`,params: { recordStatus }})
}

export const getPackage=(id:number):Promise<Response>=>{
    return http.get({url: `${packageEndpoints.getById}`, params:{id}})
}
export const addPackage=(payload:FormData):Promise<Response>=>{
    return http.post({url: packageEndpoints.create, data: payload, 'headersType':'multipart/form-data'});
}
export const updatePackage=(payload:FormData):Promise<Response>=>{
    return http.put({url: packageEndpoints.update, data: payload,'headersType':'multipart/form-data'})
}
export const getPackagesByOrg = (id: number, recordStatus: RecordStatus = RecordStatus.Active): Promise<Response> => {
    return http.get({ url: `${packageEndpoints.getByOrgId}/${id}`,params: { recordStatus } });
  };

export const deletePackage=(id:number):Promise<Response>=>{
    return http.delete({url:packageEndpoints.delete, params:{id:id}})
}