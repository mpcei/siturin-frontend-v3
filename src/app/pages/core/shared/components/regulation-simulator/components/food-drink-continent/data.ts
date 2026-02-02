import { CatalogueFoodDrinkClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Cafetería: establecimiento donde se elaboran, expenden y/o sirven alimentos de elaboración rápida o precocinada, pudiendo ser fríos y/o calientes que requieran poca preparación, así como el expendio de bebidas alcohólicas y no alcohólicas.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.cafeteria
    },
    {
        definition:
            'Bar: establecimiento donde se consumen bebidas alcohólicas y no alcohólicas, alimentos ligeros como bocaditos, picadas, sándwich, entre otros similares, cuya estructura debe tener una barra o mostrador donde se servirán las bebidas y todo aquello que ordenen los consumidores, para el consumo dentro del establecimiento. No podrá contar con área de baile.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.bar
    },
    {
        definition:
            'Restaurante: establecimiento donde se elaboran y/o expenden alimentos preparados. En estos establecimientos se puede comercializar bebidas alcohólicas y no alcohólicas También podrá ofertar servicios de cafetería y, dependiendo de la categoría, podrá disponer de servicio de autoservicio. Esta tipología incluye los establecimientos con especialidad de comida rápida.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.restaurant
    },
    {
        definition: 'Discoteca: establecimiento para escuchar música grabada y/o en vivo. bailar y consumir bebidas alcohólicas y no alcohólicas, que cuenta con pista de baile.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.nightclub
    },
    {
        definition:
            'Establecimiento móvil: establecimiento donde se elaboran, expenden y/o sirven alimentos preparados, pudiendo ser fríos y/o calientes y bebidas alcohólicas y no alcohólicas. Este tipo de establecimiento se caracteriza por prestar servicios itinerantes de alimentos y bebidas.Para el expendio de bebidas alcohólicas en establecimientos móviles que se encuentren en la vía pública deberán solicitar al Gobierno Autónomo Descentralizado competente la autorización correspondiente.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.mobile_establishment
    },
    {
        definition: 'Plazas de comida: son consideradas como los sitios que agrupan diversos establecimientos turísticos de alimentos y bebidas y que no se encuentran dentro de un centro comercial.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.food_courts
    },
    {
        definition:
            'Servicio do Catering: Es la prestación externa del suministro de comida preparada y puede abastecer de todo lo necesario para la organización de cualquier evento, banquete, fiesta o similares, y, es en general la prestación de servicios de preparación de comidas para ser vendidas o servidas en puntos de consumo separados del lugar donde se elaboran (no comprende el servicio a domicilio de un restaurante, cafetería o establecimiento de alojamiento). En el servicio puede o no incluir bebida, la mantelería, los cubiertos, el servicio de cocineros, meseros y personal de limpieza posterior al evento.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.catering_service
    }
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) o número de Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE), u otro que determine la Autoridad Tributaria.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo ',
        person: ContributorTypeEnum.natural_person
    },
    {
        label: 'Al momento de la inspección presentará el documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad de alojamiento turístico.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad correspondiente.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo.',
        person: ContributorTypeEnum.juridical_person
    }
];
