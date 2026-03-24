import { apiFetch } from './api';

export interface Customer {
  customerId: string;
  name: string;
  address: string;
  waterMeterId: string;
  status?: string; // Sẽ map sau
  newIndex?: number;
  oldIndex?: number;
  amount?: string;
}

export const customerService = {
  getCustomersByRoadmap: async (roadmapId: string, search: string = '', page: number = 0) => {
    const response = await apiFetch(`/customer/roadmap-customers/${roadmapId}?search=${search}&page=${page}&size=100`);
    console.log(response.data)
    return response.data;
  }
};
