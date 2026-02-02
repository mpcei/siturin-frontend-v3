import { ClassificationInterface } from '@modules/core/shared/interfaces/classification.interface';

export interface CategoryInterface {
    id?: string;
    classificationId?: string;
    classification?: ClassificationInterface;
    code?: string;
    name?: string;
    hasRegulation?: boolean;
}
