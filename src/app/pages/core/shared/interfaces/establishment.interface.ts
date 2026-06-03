import { CatalogueInterface, DpaInterface } from '@utils/interfaces';
import { ProcessInterface } from '@/pages/core/interfaces';
import { RucInterface } from '@/pages/core/shared/interfaces/ruc.interface';
import { CredentialInterface } from '@/pages/core/shared/interfaces/credential.interface';

export interface EstablishmentInterface {
    id?: string;
    ruc?: RucInterface;
    state?: CatalogueInterface;
    number?: string;
    tradeName?: string;
    webPage?: string;
    process?: ProcessInterface;
    province?: DpaInterface;
    canton?: DpaInterface;
    parish?: DpaInterface;
    mainStreet?: string;
    secondaryStreet?: string;
    numberStreet?: string;
    referenceStreet?: string;
    isCadastre?: boolean;
    credentials?: CredentialInterface[];
}
