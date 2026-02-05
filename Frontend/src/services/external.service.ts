import { apiClient } from '@/lib/api/client';
import { FuelPrice } from '@/types/fuel.types';

export interface RoadCondition {
    route: string;
    roadName: string;
    condition: string;
    description: string;
    icon: string;
    statusColor: 'blue' | 'orange' | 'green';
}

class ExternalService {
    private endpoint = '/external';

    getRoadConditions = async (): Promise<RoadCondition[]> => {
        return apiClient.get<RoadCondition[]>(`${this.endpoint}/road-conditions`);
    };

    getFuelPrices = async (): Promise<FuelPrice[]> => {
        return apiClient.get<FuelPrice[]>(`${this.endpoint}/fuel`);
    };
}

export const externalService = new ExternalService();
