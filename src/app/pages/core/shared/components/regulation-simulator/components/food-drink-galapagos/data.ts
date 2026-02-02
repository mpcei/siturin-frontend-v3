import { CatalogueFoodDrinkClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Cafetería: Establecimiento cuyo giro principal de negocio consiste en la elaboración, expendio y/o servicio de alimentos de elaboración rápida o precocida, pudiendo ser fríos y/o calientes. Puede comercializar bebidas alcohólicas y no alcohólicas.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.cafeteria
    },
    {
        definition:
            'Bar: Establecimiento cuyo giro principal de negocio consiste en el expendio de bebidas alcohólicas y no alcohólicas. Puede comercializar alimentos ligeros. Debe tener una barra o mostrador donde se servirán las bebidas y todo aquello que ordenen los consumidores. No podrá contar con área de baile, a menos que cumpla con los requisitos generales obligatorios para discoteca.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.bar
    },
    {
        definition:
            'Restaurante: Establecimiento cuyo giro principal de negocio consiste en la elaboración, expendio y/o servicios de alimentos preparados; puede comercializar bebidas alcohólicas y no alcohólicas; también podrá ofertar servicios de cafetería y contar con una barra de licores.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.restaurant
    },
    {
        definition:
            'Discoteca: Establecimiento diseñado para escuchar música grabada y/o en vivo, bailar y consumir bebidas alcohólicas y no alcohólicas, que cuenta con pista de baile.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.nightclub
    },
    {
        definition:
            'Plazas de comida: Son consideradas como los sitios que agrupan diversos establecimientos turísticos de servicios de alimentos y bebidas que no se encuentran dentro de un centro comercial.',
        codeClassification: CatalogueFoodDrinkClassificationsCodeEnum.food_courts
    },

];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) o Régimen Impositivo Simplificado Ecuatoriano (RISE) o aquel que sea determinado por la autoridad competente, con la actividad de servicios de alimentos y bebidas, para persona natural o jurídica, según corresponda.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Al momento de la inspección presentará el Certificado de Informe de compatibilidad de uso de suelo otorgado por el gobierno autónomo descentralizado municipal, o documento equivalente que habilite ejercer el servicio de alimentos y bebidas en el predio indicado.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Documento que acredite la situación legal del local, si es arrendado, cedido, propio o bajo cualquier figura permitida por la ley.',
        person: ContributorTypeEnum.both
    },
    {
        label: 'Al momento de la inspección presentará el documento constitutivo de la sociedad mercantil aprobado por la entidad pública correspondiente, en la que conste como su objeto social el desarrollo profesional de la actividad turística respectiva.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad correspondiente.',
        person: ContributorTypeEnum.juridical_person
    },
];
