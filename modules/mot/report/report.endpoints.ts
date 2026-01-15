import http from '@/modules/utils/axios';
import { IReportFilters } from './report.types';

const reportEndpoints = Object.freeze({
  getServiceStatistics: '/Report/GetServiceStatistics',
  getMonthlyReport: '/Report/GetMonthlyReport',
  getCustomerStatistics: '/Report/GetCustomerStatistics',
  getSystemReport: '/Report/GetSystemReport',
});

export const getServiceStatistics = (filters?: IReportFilters): Promise<Response> => {
  return http.get({ 
    url: reportEndpoints.getServiceStatistics, 
    params: filters 
  });
};

export const getMonthlyReport = (year: number, month?: number): Promise<Response> => {
  return http.get({ 
    url: reportEndpoints.getMonthlyReport, 
    params: { year, month } 
  });
};

export const getCustomerStatistics = (filters?: IReportFilters): Promise<Response> => {
  return http.get({ 
    url: reportEndpoints.getCustomerStatistics, 
    params: filters 
  });
};

export const getSystemReport = (filters?: IReportFilters): Promise<Response> => {
  return http.get({ 
    url: reportEndpoints.getSystemReport, 
    params: filters 
  });
};

