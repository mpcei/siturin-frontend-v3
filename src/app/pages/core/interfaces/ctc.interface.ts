import { CatalogueInterface } from "@utils/interfaces";
import { TouristGuideInterface } from "./tourist-guide.interface";
import { TouristTransportCompanyInterface } from '@/pages/core/shared/interfaces/tourist-transport-company.interface';

export interface CtcInterface {
  processId: string;
  type: CatalogueInterface;
  activity: { id: string };
  classification: { id: string };
  category: { id: string };
  localType: { id: string };
  accommodation: AccommodationInterface;
  foodDrink: FoodDrinkInterface;
  hasPropertyRegistrationCertificate: boolean;
  hasStatute: boolean;
  hasTechnicalReport: boolean;
  communityOperation: CommunityOperationInterface;
  transport: TouristTransportCompanyInterface;
}

export interface AccommodationInterface {
  totalRooms: number;
  totalBeds: number;
  totalPlaces: number;
}

export interface FoodDrinkInterface {
  totalTables: number;
  totalCapacities: number;
}

export interface CommunityOperationInterface {
  hasGuide: boolean;
  touristGuides: TouristGuideInterface[];
}

export interface TransportInterface {
  authorizationNumber: number;
  ruc: number;
  rucType: string;
  socialReason: string;
  type: string;
}
