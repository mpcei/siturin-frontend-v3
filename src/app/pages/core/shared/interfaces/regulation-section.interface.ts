import { RegulationItemInterface } from '@modules/core/shared/interfaces';

export interface RegulationSectionInterface {
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
    items: RegulationItemInterface[];
}
