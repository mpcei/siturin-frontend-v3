import { CatalogueAccommodationClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Hotel:  Establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer servicio de hospedaje en habitaciones privadas con cuarto de baño y aseo privado, ocupando la totalidad de un edificio o parte independiente del mismo, cuenta con el servicio de alimentos y bebidas en un área definida como restaurante o cafetería, según su categoría, sin perjuicio de proporcionar otros servicios complementarios. Deberá contar con mínimo de 5 habitaciones.Para el servicio de hotel apartamento se deberá ofrecer el servicio de hospedaje en apartamentos que integren una unidad para este uso exclusivo. Cada apartamento debe estar compuesto como mínimo de los siguientes ambientes: dormitorio, baño, sala de estar integrada con comedor y cocina equipada. Facilita la renta y ocupación de estancias largas.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.hotel
    },
    {
        definition:
            'Hostal: establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones privadas o compartidas con cuarto de baño y aseo privado o compartido, según su categoría, ocupando la totalidad de un edificio o parte independiente del mismo; puede prestar el servicio de alimentos y bebidas (desayuno, almuerzo y/o cena) a sus huéspedes, sin perjuicio de proporcionar otros servicios complementarios. Deberá contar con un mínimo de 5 habitaciones.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.hostel
    },
    {
        definition:
            'Hostería : establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones o cabañas privadas, con cuarto de baño y aseo privado que pueden formar bloques independientes, ocupando la totalidad de un inmueble o parte independiente del mismo; presta el servicio de alimentos y bebidas, sin perjuicio de proporcionar otros servicios complementarios. Cuenta con jardines, áreas verdes, zonas de recreación y deportes, estacionamiento. Deberá contar con un mínimo de 5 habitaciones.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.inn
    },
    {
        definition:
            'Hacienda Turística: establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones privadas con cuarto de baño y aseo privado y/o compartido conforme a su categoría, localizadas dentro de parajes naturales o áreas cercanas a centros poblados. Su construcción puede tener valores patrimoniales, históricos, culturales y mantiene actividades propias del campo como siembra, huerto orgánico, cabalgatas, actividades culturales patrimoniales, vinculación con la comunidad local, entre otras; permite el disfrute en contacto directo con la naturaleza, cuenta con estacionamiento y presta servicio de alimentos y bebidas, sin perjuicio de proporcionar otros servicios complementarios. Deberá contar con un mínimo de 5 habitaciones',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.tourist_ranch
    },
    {
        definition:
            'Lodge: establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones o cabañas privadas, con cuarto de baño y aseo privado y/o compartido conforme a su categoría. Ubicado en entornos naturales en los que se privilegia el paisaje y mantiene la armonización con el ambiente. Sirve de enclave para realizar excursiones organizadas, tales como observación de flora y fauna, culturas locales, caminatas por senderos, entre otros. Presta el servicio de alimentos y bebidas sin perjuicio de proporcionar otros servicios complementarios. Deberá contar con un mínimo de 5 habitaciones.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.lodge
    },
    {
        definition:
            'Resort: es un complejo turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones privadas con cuarto de baño y aseo privado, que tiene como propósito principal ofrecer actividades de recreación, diversión, deportivas y/o de descanso, en el que se privilegia el entorno natural; posee diversas instalaciones, equipamiento y variedad de servicios complementarios, ocupando la totalidad de un inmueble. Presta el servicio de alimentos y bebidas en diferentes espacios adecuados para el efecto. Puede estar ubicado en áreas vacacionales o espacios naturales como montañas, playas, bosques, lagunas, entre otros. Deberá contar con un mínimo de 5 habitaciones.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.resort
    },
    {
        definition:
            'Refugio: establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje en habitaciones privadas y/o compartidas, con cuarto de baño y aseo privado y/o compartido; dispone de un área de estar, comedor y cocina y puede proporcionar otros servicios complementarios. Se encuentra localizado generalmente en montañas y en áreas naturales protegidas, su finalidad es servir de protección a las personas que realizan actividades de turismo activo.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.shelter
    },
    {
        definition:
            '"Campamento Turístico: establecimiento de alojamiento turístico que cuenta con instalaciones para ofrecer el servicio de hospedaje para descansar, aclimatar o pernoctar en tiendas de campaña o infraestructura fija o móvil, en una superficie debidamente delimitada y acondicionada para este fin.En caso de campamentos turísticos que se encuentren dentro del Subsistema Estatal del Sistema Nacional de Áreas Protegidas, se deberá cumplir con el Anexo 6B, sin perjuicio del cumplimiento de los requisitos y lineamientos determinados en los respectivos planes de manejo, zonificación, regulación ambiental, planes de manejo de visitantes de cada área protegida y demás normativa e instrumentos técnicos de la Autoridad Ambiental Nacional."',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.tourist_camp
    },
    {
        definition:
            'Casa de Huéspedes : establecimiento de alojamiento turístico para hospedaje, que se ofrece en la vivienda en donde reside el prestador del servicio; cuenta con habitaciones privadas con cuartos de baño y aseo privado; puede prestar el servicio de alimentos y bebidas (desayuno y/o cena) a sus huéspedes. Debe cumplir con los requisitos establecidos en el presente Reglamento y su capacidad mínima será de dos y máxima de cuatro habitaciones destinadas al alojamiento de los turistas, con un máximo de seis plazas por establecimiento.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.guest_house
    },
    {
        definition:
            'Inmuebles Habitacionales: bienes inmuebles de propiedad privada de personas naturales o jurídicas, destinados al recibimiento habitual y temporal de huéspedes, distintos a los establecimientos previstos en el Reglamento de Alojamiento Turístico.No se podrá denominar como inmueble habitacional a aquellos establecimientos de alojamiento turístico regulados de acuerdo a las disposiciones del Reglamento de Alojamiento Turístico.',
        codeClassification: CatalogueAccommodationClassificationsCodeEnum.residential_properties
    }
];

export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) o número de Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE), u otro que determine la Autoridad Tributaria.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Al momento de la inspección presentará el documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad de alojamiento turístico.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad correspondiente.',
        person: ContributorTypeEnum.juridical_person
    }
];
