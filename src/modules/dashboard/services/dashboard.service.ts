import httpClient from '@/shared/api/httpClient';
import { DashboardData } from '../types/dashboard.types';

const API_URL = '/api/dashboard';

export const dashboardService = {
  obtenerDashboard: async (): Promise<DashboardData> => {
    const response = await httpClient.get(API_URL);
    return response.data;
  }
};
