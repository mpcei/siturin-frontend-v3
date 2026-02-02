export enum RegulationSimulatorFormEnum {
    constributorType = 'Tipo de Contribuyente',
    activity = 'Actividad',
    geographicArea = 'Zona Geográfica',
    classification = 'Clasificación',
    category = 'Categoría'
}

export enum CatalogueActivitiesCodeEnum {
    accommodation_continent = 'accommodation_continent',
    accommodation_galapagos = 'accommodation_galapagos',
    agency_continent = 'agency_continent',
    agency_galapagos = 'agency_galapagos',
    ctc_continent = 'ctc_continent',
    ctc_galapagos = 'ctc_galapagos',
    event_continent = 'event_continent',
    event_galapagos = 'event_galapagos',
    food_drink_continent = 'food_drink_continent',
    food_drink_galapagos = 'food_drink_galapagos',
    park_continent = 'park_continent',
    park_galapagos = 'park_galapagos',
    transport_continent = 'transport_continent',
    transport_galapagos = 'transport_galapagos'
}


export enum CatalogueCtcActivitiesCodeEnum {
  accommodation = 'accommodation',
  community_operation = 'community_operation',
  food_drink = 'food_drink',
  transport = 'transport',
}

export enum CatalogueAccommodationClassificationsCodeEnum {
  hotel = 'hotel',
  hostel = 'hostel',
  inn = 'inn',
  resort = 'resort',
  lodge = 'lodge',
  guest_house = 'guest_house',
  shelter = 'shelter',
  tourist_camp = 'tourist_camp',
  residential_properties = 'residential_properties',
  tourist_ranch = 'tourist_ranch',
}

export enum CatalogueAgencyClassificationsCodeEnum {
  wholesale_travel_agency = 'wholesale_travel_agency',
  international_travel_agency = 'international_travel_agency',
  tour_operator = 'tour_operator',
  dual_travel_agency = 'dual_travel_agency'
}

export enum CatalogueCtcClassificationsCodeEnum {
  ctc = 'ctc'
}

export enum CatalogueEventClassificationsCodeEnum {
  events = 'events',
  conventions = 'conventions',
  rooms = 'rooms'
}

export enum CatalogueFoodDrinkClassificationsCodeEnum {
  cafeteria = 'cafeteria',
  bar = 'bar',
  restaurant = 'restaurant',
  nightclub = 'nightclub',
  mobile_establishment = 'mobile_establishment',
  food_courts = 'food_courts',
  catering_service = 'catering_service'
}

export enum CatalogueParkClassificationsCodeEnum {
  parks = 'parks',
  bowling_alleys = 'bowling_alleys',
  tracks = 'tracks',
  hot_springs = 'hot_springs',
  spas = 'spas',
  centers = 'centers'
}

export enum CatalogueTransportClassificationsCodeEnum {
  air_transport = 'air_transport',
  maritime_transport = 'maritime_transport',
  land_transport = 'land_transport'
}

export enum ContributorTypeEnum {
    natural_person = 'natural_person',
    both = 'both',
    juridical_person = 'juridical_person'
}

export enum ValidationTypeEnum {
    REQUIRED_ITEMS = 'REQUIRED_ITEMS',
    MINIMUM_ITEMS = 'MINIMUM_ITEMS',
    SCORE_BASED = 'SCORE_BASED'
}
