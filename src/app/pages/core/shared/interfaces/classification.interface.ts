import { ActivityInterface } from '@modules/core/shared/interfaces/activity.interface';

export interface ClassificationInterface {
    id?: string;
    activityId?: string;
    activity?: ActivityInterface;
    code?: string;
    name?: string;
    hasRegulation?: boolean;
}
