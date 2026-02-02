import { CategoryInterface } from '@/pages/core/shared/interfaces/category.interface';


export interface CategoryConfigurationInterface {
    id:               string;
    createdAt:        Date;
    updatedAt:        Date;
    deletedAt:        null;
    enabled:          boolean;
    classificationId: string;
    category:         CategoryInterface;
    categoryId:       string;
    idTemp:           string;
    min:              number;
    max:              number;
    sort:             number;
}

