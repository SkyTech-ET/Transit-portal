import http from '@/modules/utils/axios';

const dashboardEndpoints = Object.freeze({
  manager: '/Manager/GetDashboard',
  caseExecutor: '/CaseExecutor/GetDashboard',
  assessor: '/Assessor/GetDashboard',
  dataEncoder: '/DataEncoder/GetDashboard',
});

export const getManagerDashboard = (): Promise<Response> => {
  return http.get({ url: dashboardEndpoints.manager });
};

export const getCaseExecutorDashboard = (): Promise<Response> => {
  return http.get({ url: dashboardEndpoints.caseExecutor });
};

export const getAssessorDashboard = (): Promise<Response> => {
  return http.get({ url: dashboardEndpoints.assessor });
};

export const getDataEncoderDashboard = (): Promise<Response> => {
  return http.get({ url: dashboardEndpoints.dataEncoder });
};

