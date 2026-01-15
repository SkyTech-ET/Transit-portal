import http from "@/modules/utils/axios";

const dashboardEndpoints = Object.freeze({
  getDashboard: "/CaseExecutor/dashboard",
});

export const getDashboardData = () => {
  return http.get({
    url: dashboardEndpoints.getDashboard,
  });
};
export const caseExecutorEndpoints = {
  getAssignedServiceById: "/CaseExecutor/GetAssignedServiceById",
  updateStageStatus: "/CaseExecutor/UpdateStageStatus",
  uploadStageDocument: "/CaseExecutor/UploadStageDocument",
  addStageComment: "/CaseExecutor/AddStageComment",
};

export const apiGetAssignedServiceById = (id: number): Promise<Response> => {
  return http.get({
    url: `${caseExecutorEndpoints.getAssignedServiceById}?id=${id}`,
  });
};

export const apiUpdateStageStatus = (
  stageId: number,
  status: number,
  comments?: string
): Promise<Response> => {
  return http.put({
    url: caseExecutorEndpoints.updateStageStatus,
    data: {
      stageId,
      status,
      comments: comments || null,
    },
  });
};

export const apiUploadStageDocument = (
  stageId: number,
  file: File,
  documentType: number = 6
): Promise<Response> => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("documentType", documentType.toString());

  return http.post({
    url: `${caseExecutorEndpoints.uploadStageDocument}?stageId=${stageId}`,
    data: fd,
  });
};
