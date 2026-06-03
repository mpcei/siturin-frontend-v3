import { ClassificationInterface } from './classification.interface';

export interface CredentialInterface {
    id?: string;
    classification?: ClassificationInterface;
    startedAt?: Date;
    endedAt?: Date;
    stateCode?: string;
    stateName?: string;
    code?: string;
}
