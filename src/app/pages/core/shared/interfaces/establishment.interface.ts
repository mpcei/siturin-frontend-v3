import { CatalogueInterface } from '@utils/interfaces';
import { ProcessInterface } from '@/pages/core/interfaces';

export interface EstablishmentInterface {
    id?: string;
    ruc?: string;
    state?: CatalogueInterface;
    number?: string;
    tradeName?: string;
    webPage?: string;
    process?: ProcessInterface;
}
