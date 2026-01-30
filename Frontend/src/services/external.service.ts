import { apiClient } from '@/lib/api/client';

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
}

export const externalService = new ExternalService();
