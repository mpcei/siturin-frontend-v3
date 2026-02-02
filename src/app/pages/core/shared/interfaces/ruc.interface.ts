import { CatalogueInterface } from '@utils/interfaces';
import { EstablishmentInterface } from '@modules/core/shared/interfaces';

export interface RucInterface {
    id?: string;
    tradeName?: CatalogueInterface;
    legalName?: string;
    establishments?: EstablishmentInterface[];
}
