import { DpaInterface } from '@utils/interfaces';
import { EstablishmentInterface, ProcessInterface } from '@modules/core/shared/interfaces';

export interface EstablishmentAddressInterface {
    establishment?: EstablishmentInterface;
    establishmentId?: string;
    process?: ProcessInterface;
    processId?: string;
    province?: DpaInterface;
    provinceId?: string;
    canton?: DpaInterface;
    cantonId?: string;
    parish?: DpaInterface;
    parishId?: string;
    mainStreet?: string;
    numberStreet?: string;
    secondaryStreet?: string;
    referenceStreet?: string;
    latitude?: number;
    longitude?: number;
}
