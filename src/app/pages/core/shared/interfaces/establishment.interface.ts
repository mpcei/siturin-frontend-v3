import { CatalogueInterface, DpaInterface } from '@utils/interfaces';
import { ProcessInterface } from '@/pages/core/interfaces';
import { RucInterface } from '@/pages/core/shared/interfaces/ruc.interface';
import { CredentialInterface } from '@/pages/core/shared/interfaces/credential.interface';

import { LanguageInterface } from '@/pages/core/shared/interfaces/language.interface';
import { AdventureModalityInterface } from '@/pages/core/shared/interfaces/adventure-modality.interface';
import {
    EstablishmentContactPersonInterface
} from '@/pages/core/shared/interfaces/establishment-contact-person.interface';

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
    adventureModalities?: AdventureModalityInterface[];
    currentProcess?: CurrentProcess;
    establishmentContactPerson?:EstablishmentContactPersonInterface;
}

interface CurrentProcess {
    type: CatalogueInterface;
    credentials?: CredentialInterface[];
}
