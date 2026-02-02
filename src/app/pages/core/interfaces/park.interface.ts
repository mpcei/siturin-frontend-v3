export interface ParkInterface {
    processId: string;
    activity: { id: string };
    category: { id: string };
    classification: { id: string };
    totalCapacities: number;
    localType: string;
    isProtectedArea: boolean;
    hasProtectedAreaContract: boolean;
    type: { id: string };
}
