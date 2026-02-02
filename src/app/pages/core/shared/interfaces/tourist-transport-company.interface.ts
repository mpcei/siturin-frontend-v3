import { CatalogueInterface } from '@utils/interfaces';

export interface TouristTransportCompanyInterface {
    id?: string;
    authorizationNumber: string;
    ruc?: string;
    rucType?: CatalogueInterface;
    legalName?: string;
    type?: CatalogueInterface;
}
