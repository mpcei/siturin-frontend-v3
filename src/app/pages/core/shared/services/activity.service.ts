import { inject, Injectable } from '@angular/core';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface } from '@utils/interfaces';
import { ActivityInterface, CategoryInterface, ClassificationInterface } from '@modules/core/shared/interfaces';
import { CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services';

@Injectable({
    providedIn: 'root'
})
export class ActivityService {
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    async findActivitiesByZone(geographicAreaId: string): Promise<ActivityInterface[]> {
        let activities: ActivityInterface[] = [];

        if (sessionStorage.getItem(CoreEnum.activities)) {
            activities = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.activities);
            activities = Object.values(activities);

            activities = activities
                .filter((item) => {
                    return item.geographicAreaId === geographicAreaId;
                })
                .map((item) => {
                    return {
                        id: item.id,
                        code: item.code,
                        name: item.name
                    };
                });
        }

        return activities;
    }

    async findActivitiesByZone2(): Promise<ActivityInterface[]> {
        let activities: ActivityInterface[] = [];

        if (sessionStorage.getItem(CoreEnum.activities)) {
            activities = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.activities);
            activities = Object.values(activities);

            activities = activities
                .map((item) => {
                    return {
                        id: item.id,
                        code: item.code,
                        name: item.name
                    };
                });
        }

        return activities;
    }

    async findClassificationsByActivity(activityId: string): Promise<ClassificationInterface[]> {
        let classifications: ClassificationInterface[] = [];

        if (sessionStorage.getItem(CoreEnum.classifications)) {
            classifications = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.classifications);
            classifications = Object.values(classifications);

            classifications = classifications
                .filter((item) => {
                    return item.activityId === activityId;
                })
                .map((item) => {
                    return {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        hasRegulation: item.hasRegulation
                    };
                });
        }

        return classifications;
    }

    async findCategoriesByClassification(classificationId: string): Promise<CategoryInterface[]> {
        let categories: CategoryInterface[] = [];

        if (sessionStorage.getItem(CoreEnum.categories)) {
            categories = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.categories);
            categories = Object.values(categories);

            categories = categories
                .filter((item) => {
                    return item.classificationId === classificationId;
                })
                .map((item) => {
                    return {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        hasRegulation: item.hasRegulation
                    };
                });
        }

        return categories;
    }
}
