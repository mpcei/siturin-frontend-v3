import { CatalogueInterface } from '@utils/interfaces';
import { ActivityInterface, ClassificationInterface } from '@modules/core/shared/interfaces';
import { CadastreInterface } from './cadastre.interface';

export interface ProcessInterface {
    id?: string;
    geographicArea?: CatalogueInterface;
    geographicAreaId?: string;
    code?: string;
    name?: string;
    activity?: ActivityInterface;
    classifications?: ClassificationInterface[];
    cadastre: CadastreInterface;
}
