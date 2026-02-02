import { CatalogueAgencyClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Agencia de Viajes  Mayorista: Es la persona jurídica debidamente registrada; que elabora, organiza y comercializa servicios y/o paquetes turísticos en el exterior. La comercialización se realiza por medio de agencias de viajes internacionales y/o agencias de viajes duales debidamente registradas, quedando prohibida su comercialización de manera directa al usuario o consumidor final de servicios turísticos.La agencia mayorista podrá representar a las empresas de transporte turístico en sus diferentes modalidades, alojamiento y operadores turísticos que no operen en el país.',
        codeClassification: CatalogueAgencyClassificationsCodeEnum.wholesale_travel_agency
    },
    {
        definition:
            'Agencia de Viajes Internacional: Es la persona jurídica debidamente registrada; que comercializa los servicios y/o paquetes turísticos internacionales de las agencias mayoristas directamente al usuario. También podrá comercializar el producto del operador turístico ecuatoriano. Las agencias de viajes internacionales no podrán elaborar y organizar productos y servicios propios que se desarrollen a nivel nacional y comercializarlos a otras agencias de viajes internacionales que se encuentren domiciliadas en el país, ya que esa es potestad de las agencias operadoras y mayoristas. Las agencias de viajes internacionales que cuenten con licencia IATA, podrán ejercer la consolidación de tiquetes aéreos requeridos por parte de las agencias de servicios turísticos.',
        codeClassification: CatalogueAgencyClassificationsCodeEnum.international_travel_agency
    },
    {
        definition:
            'Agencia Operadora de Turismo: Es la persona jurídica debidamente registrada que se dedica a la organización, desarrollo y operación directa de viajes y visitas turísticas en el país, enfocados al turismo interno y receptivo. Sus productos podrán ser comercializados de forma directa al usuario o a través de las agencias de viajes internacionales, mayoristas o duales.',
        codeClassification: CatalogueAgencyClassificationsCodeEnum.tour_operator
    },
    {
        definition:
            'Agencia de Viaje Dual: Es la persona jurídica debidamente registrada que comercializa los servicios y/o paquetes turísticos internacionales de las agencias mayoristas directamente al usuario; y también podrá comercializar el producto del operador turístico ecuatoriano, u organizar, desarrollar y operar de manera directa, viajes y visitas turísticas en el país, enfocados al turismo interno y receptivo.',
        codeClassification: CatalogueAgencyClassificationsCodeEnum.dual_travel_agency
    }
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC).',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Documento constitutivo de la compañía debidamente aprobada por la autoridad competente.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección presentará el Nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad competente.',
        person: ContributorTypeEnum.juridical_person
    }
];
