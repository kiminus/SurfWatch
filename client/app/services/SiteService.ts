import { AxiosError } from 'axios';
import { Site } from '../models/site';
import ApiClient from './ApiClient';
import { AppContextType } from '../contexts/AppContext';

export default {
  async getAllSites(
    currentSite: AppContextType['currentSite'],
    setCurrentSite: AppContextType['setCurrentSite']
  ): Promise<Site[]> {
    try {
      const response = await ApiClient.get<Site[]>('/sites/rec');
      const sites = response.data as unknown as Site[];
      if (sites.length > 0 && !currentSite) {
        setCurrentSite(sites[0]);
      }
      return sites;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        console.log('No active session found (401).');
      } else {
        console.error('Error fetching current user:', axiosError.message);
      }
      return [];
    }
  },
};
