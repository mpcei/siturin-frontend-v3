import { CadastreStateInterface } from '@/pages/core/interfaces/cadastre-state.interface';
import { CatalogueInterface } from '@utils/interfaces';

export interface CadastreInterface {
    id?: string;
    state?: CatalogueInterface;
    cadastreState?: CadastreStateInterface;
    registerNumber?: string;
    registeredAt?: Date;
}
