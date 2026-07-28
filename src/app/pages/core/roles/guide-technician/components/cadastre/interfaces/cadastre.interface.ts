import { CadastreStateInterface } from '@/pages/core/interfaces/cadastre-state.interface';
import { CatalogueInterface } from '@utils/interfaces';

export interface CadastreInterface {
    id?: string;
    state?: CatalogueInterface;
    cadastreState?: CadastreStateInterface;
    registerNumber?: string;
    registeredAt?: Date;
    process?: ProcessInterface;
}

interface ProcessInterface {
    id?: string;
    establishment: EstablishmentInterface;
}

interface EstablishmentInterface {
    id?: string;
    ruc?: string;
    state?: CatalogueInterface;
    number?: string;
    tradeName?: string;
    webPage?: string;
    process?: ProcessInterface;
}
