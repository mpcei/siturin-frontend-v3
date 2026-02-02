export interface RegulationItemInterface {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    required: boolean;
    score: null;
    sort: number;
    enabled: boolean;
    isCompliant?: boolean;
}
