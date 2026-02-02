import { CatalogueInterface } from '@utils/interfaces';

export interface RoomInterface {
    id?: string;
    roomType?: CatalogueInterface;
    totalRooms?: number;
    totalBeds?: number;
    totalPlaces?: number;
}
