export interface FoodDrinkInterface {
    totalTables: number;
    totalCapacities: number;
    kitchenTypes: KitchenType[];
    serviceTypes: ServiceType[];
    hasLandUse: boolean;
  }
  
  export interface KitchenType {
    id: string;
    code: string;
  }
  
  export interface ServiceType {
    id: string;
    code: string;
  }