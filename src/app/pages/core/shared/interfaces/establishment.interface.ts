import { CatalogueInterface, DpaInterface } from '@utils/interfaces';
import { ProcessInterface } from '@/pages/core/interfaces';
import { RucInterface } from '@/pages/core/shared/interfaces/ruc.interface';

export interface EstablishmentInterface {
    id?: string;
    ruc?: RucInterface;
    state?: CatalogueInterface;
    number?: string;
    tradeName?: string;
    webPage?: string;
    process?: ProcessInterface;
    province: DpaInterface;
    canton: DpaInterface;
    parish: DpaInterface;
}
