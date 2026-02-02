import { CatalogueInterface } from '@utils/interfaces';
import { ClassificationInterface } from '@modules/core/shared/interfaces/classification.interface';

export interface ActivityInterface {
    id?: string;
    geographicArea?: CatalogueInterface;
    geographicAreaId?: string;
    code?: string;
    name?: string;
    classifications?: ClassificationInterface[];
}
