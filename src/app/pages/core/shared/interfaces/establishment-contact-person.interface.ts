import { EstablishmentInterface, ProcessInterface } from '@modules/core/shared/interfaces';

export interface EstablishmentContactPersonInterface {
    establishment?: EstablishmentInterface;
    establishmentId?: string;
    process?: ProcessInterface;
    processId?: string;
    isCurrent?: string;
    identification?: string;
    email?: string;
    name?: string;
    phone?: string;
    secondaryPhone?: string;
}
