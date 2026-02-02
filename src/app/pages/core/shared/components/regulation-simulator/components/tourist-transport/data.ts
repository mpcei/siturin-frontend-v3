import { CatalogueTransportClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Transporte Turístico Aéreo: Modalidad de transporte turístico, que consiste en la prestación del servicio de transporte aerocomercial con operación regular, para el desplazamiento de personas, que pueden ser o no turistas o excursionistas, dentro y fuera del país, en forma individual o en grupos homogéneos, en aeronaves motorizadas, debidamente certificadas por la autoridad aeronáutica competente. La operación de vuelos chárter deberá ser comercializada a través de una agencia de servicios turísticos.',
        codeClassification: CatalogueTransportClassificationsCodeEnum.air_transport
    },
    {
        definition:
            'Transporte Turístico Marítimo, Fluvial y Lacustre :Modalidad de transporte turístico, que consiste en la prestación del servicio de transporte acuático con fines comerciales, para el desplazamiento de personas que tengan la condición de turistas o excursionistas en forma individual o en grupos homogéneos por mar, ríos o lagos en embarcaciones turísticas motorizadas acondicionadas para el efecto, debidamente autorizadas por la autoridad marítima y fluvial competente. Se excluye de esta clasificación a las motos acuáticas en cualquiera de sus tipos.',
        codeClassification: CatalogueTransportClassificationsCodeEnum.maritime_transport
    },
    {
        definition:
            'Transporte Turístico Terrestre : Modalidad de transporte turístico, que consiste en la prestación del servicio de transporte terrestre con fines comerciales, para el desplazamiento de personas que tengan la condición de turistas o excursionistas en forma individual o en grupos homogéneos en vehículos terrestres motorizados debidamente habilitados por la autoridad competente en materia de tránsito.',
        codeClassification: CatalogueTransportClassificationsCodeEnum.land_transport
    }
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Documento constitutivo de la compañía debidamente aprobada por la autoridad competente',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad competente;',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Contar con un espacio físico permanente para el desarrollo de sus actividades comerciales y administrativas, el mismo que deberá ser obligatoriamente local comercial, oficinas, oficinas compartidas, islas de centros comerciales, con especificación clara y precisa de su ubicación y domicilio. En el caso de las aerolíneas internacionales que no cuenten con espacio físico, se le solicitará la dirección exacta de sus representantes legales o apoderados; ',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) ',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará el Certificado de Operador Aéreo (AOC) o Reconocimiento de Certificado de Operador Aéreo (AOCR) emitido por la Dirección General de Aviación Civil. ',
        person: ContributorTypeEnum.juridical_person
    }
];
