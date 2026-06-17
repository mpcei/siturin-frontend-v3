import { ClassificationInterface } from './classification.interface';
import { CategoryInterface } from '@/pages/core/shared/interfaces/category.interface';
import { CatalogueInterface } from '@utils/interfaces';

export interface CredentialInterface {
    id?: string;
    createdAt: Date;
    classification?: ClassificationInterface;
    classificationId?: string;
    startedAt?: Date;
    endedAt?: Date;
    stateCode?: string;
    stateName?: string;
    code?: string;
    deletedAt: Date;
    updatedAt: Date;
    category: CategoryInterface;
    geographicArea: CatalogueInterface;
    enabled: boolean;
    processId: string;
    categoryId: string;
    establishmentId: string;
    geographicAreaId: string;
    origin: string;
}
