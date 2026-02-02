import { CatalogueEventClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Organizadores de eventos: Personas naturales o jurídicas legalmente constituidas que se dediquen a la organización de eventos como congresos, convenciones, ferias, seminarios, exhibiciones, conferencias, incentivos, bodas, reuniones de toda clase o similares, en sus etapas de gerenciamiento, planeación, promoción y realización, así como a la asesoría y/o producción de estos eventos de manera total o parcial a nivel nacional.',
        codeClassification: CatalogueEventClassificationsCodeEnum.events
    },
    {
        definition:
            'Centros de convenciones: Persona natural o jurídica que cuenta con un establecimiento con espacios específicos para recibir público para el desarrollo de eventos de diferente naturaleza como asambleas, conferencias, seminarios, ferias, conciertos, entre otros. Además, para la prestación del servicio requerirá servicios higiénicos o baterías sanitarias y parqueadero propio o arrendado. Puede ofrecer el servicio de alimentos y bebidas de manera directa o a través de un tercero.',
        codeClassification: CatalogueEventClassificationsCodeEnum.conventions
    },
    {
        definition:
            'Sala de recepciones y banquetes: Persona natural o jurídica que cuenta con un establecimiento que oferta un espacio fijo que puede ser abierto o cerrado, para la realización de eventos de carácter social; empresarial y/o familiar. Además, para la prestación del servicio requerirá: servicios higiénicos o baterías sanitarias y parqueadero propio o arrendado.Los establecimientos que, a más de ofrecer el espacio físico para este tipo de actividades, presten como servicio propio el alquiler de mobiliario, equipos, vajilla, menaje acorde al evento y servicio de alimentos y bebidas, serán diferenciados con la categoría que corresponda para este tipo de establecimientos.',
        codeClassification: CatalogueEventClassificationsCodeEnum.rooms
    }
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC), número de Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE), u otro que determine la Autoridad Tributaria, en la que consten los datos informativos correspondientes a razón social, el nombre comercial, número del local, dirección y actividad del establecimiento del que se obtendrá el Registro de Turismo.',
        person: ContributorTypeEnum.natural_person
    },
    {
        label: 'Al momento de la inspección presentará el Documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad y/o modalidad turística.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) o Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE) en el que conste la actividad regulada en este Reglamento. ',
        person: ContributorTypeEnum.juridical_person
    }
];
