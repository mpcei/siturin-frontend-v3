import { CatalogueInterface } from '@utils/interfaces';
import { ClassificationInterface } from '@modules/core/shared/interfaces';
import { CadastreInterface } from './cadastre.interface';

export interface ProcessInterface {
    id?: string;
    geographicArea?: CatalogueInterface;
    geographicAreaId?: string;
    code?: string;
    name?: string;
    classifications?: ClassificationInterface[];
    cadastre: CadastreInterface;
}
