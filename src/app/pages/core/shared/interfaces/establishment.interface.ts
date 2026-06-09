import { CatalogueInterface, DpaInterface } from '@utils/interfaces';
import { ProcessInterface } from '@/pages/core/interfaces';
import { RucInterface } from '@/pages/core/shared/interfaces/ruc.interface';
import { CredentialInterface } from '@/pages/core/shared/interfaces/credential.interface';
import {
    AdventureTourismModalityInterface
} from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/adventure-tourism-modality/adventure-tourism-modality.component';
import { LanguageInterface } from '@/pages/core/shared/interfaces/language.interface';

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
    languages?: LanguageInterface[];
    adventureModalities?: AdventureTourismModalityInterface[];
}
