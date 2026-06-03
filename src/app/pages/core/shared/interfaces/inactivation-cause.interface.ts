import { ProcessInterface } from '@/pages/core/interfaces';

export interface InactivationCauseInterface {
    id?: string;
    process?: ProcessInterface;
    code?: string;
}
