import { CadastreStateInterface } from '@/pages/core/interfaces/cadastre-state.interface';

export interface CadastreInterface {
    id?: string;
    cadastreState?: CadastreStateInterface;
    registerNumber?: string;
}
