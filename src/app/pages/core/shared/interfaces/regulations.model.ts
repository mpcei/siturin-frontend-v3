export interface RegulationSection {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    validationType: null | string;
    minimumScore: null;
    minimumItems: null;
    sort: number;
    modelId: number;
    isAdventureRequirement: boolean;
    isProtectedArea: boolean;
    enabled: boolean;
    items: RegulationItem[];
}

export interface RegulationItem {
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

export interface FormSubmission {
    category: string;
    items: {
        id: string;
        isCompliant: boolean;
        score: number;
    };
}
