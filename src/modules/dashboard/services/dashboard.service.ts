import axios from 'axios';
import { DashboardData } from '../types/dashboard.types';

const API_URL = 'http://localhost:8080/api/dashboard';

export const dashboardService = {
  obtenerDashboard: async (): Promise<DashboardData> => {
    const response = await axios.get(API_URL);
    return response.data;
  }
};
