import { ActivityInterface } from '@modules/core/shared/interfaces/activity.interface';

export interface ClassificationInterface {
    id?: string;
    activityId?: string;
    activity?: ActivityInterface;
    acronym?: string;
    code?: string;
    name?: string;
    hasRegulation?: boolean;
}
