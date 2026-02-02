import { CatalogueCtcClassificationsCodeEnum, ContributorTypeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        definition:
            'Centros de Turismo Comunitario: se define al Centro de Turismo Comunitario como un modelo de gestión del turismo, que se desarrolla en territorios comunitarios de las nacionalidades y pueblos reconocidos de acuerdo con la Constitución de la República del Ecuador y las leyes correspondientes.Es un mecanismo que fomenta y garantiza el desarrollo del turismo en las comunidades, pueblos y nacionalidades, reconociendo la iniciativa comunitaria como un pilar fundamental para el desarrollo turístico en el Ecuador, asegurando el mismo desarrollo de oportunidades que a otros sectores involucrados en la actividad.',
        codeClassification: CatalogueCtcClassificationsCodeEnum.ctc
    }
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección se presentará certificado actualizado del registro de la propiedad en el que se determine la titularidad del predio a favor de la comunidad u organización comunitaria en el que se desarrollará la actividad como Centro de Turismo Comunitario, con el señalamiento de linderos y límites.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará Informe técnico que justifique la calidad comunitaria de la organización que solicita el registro, expedido por la Secretaría de Gestión y Desarrollo de Pueblos y Nacionalidades, o la entidad que ejerza dichas atribuciones. ',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará nombramiento vigente que acredite la representación legal del peticionario.',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará la copia certificada del Estatuto de la comunidad, en la que debe indicar que sí podrán realizar la actividad de turismo comunitario. ',
        person: ContributorTypeEnum.juridical_person
    },
    {
        label: 'Al momento de la inspección se presentará el Registro único de contribuyentes (RUC), de la persona jurídica solicitante, en la que conste, como una de sus actividades la prestación de servicios turísticos.',
        person: ContributorTypeEnum.juridical_person
    }
];
