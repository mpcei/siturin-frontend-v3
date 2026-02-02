export interface RegulationResponseInterface {
    category: string;
    regulationResponses: {
        id: string;
        isCompliant: boolean;
        score: number;
    };
}
