import { CatalogueInterface } from '@utils/interfaces';
import { ClassificationInterface } from '@modules/core/shared/interfaces';

export interface ProcessInterface {
    id?: string;
    geographicArea?: CatalogueInterface;
    geographicAreaId?: string;
    code?: string;
    name?: string;
    classifications?: ClassificationInterface[];
}
