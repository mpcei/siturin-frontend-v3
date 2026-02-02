import { CatalogueParkClassificationsCodeEnum } from '../../enum';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';

export const data: HeaderRegulation[] = [
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Parques de atracciones estables: Persona natural o jurídica que cuenta con un establecimiento que oferta servicios de recreación masiva, construidos y equipados en una ubicación fija. Para la prestación del servicio contará con atracciones como: juegos acuáticos, o juegos mecánicos, o juegos de destrezas, o juegos inflables y/o juegos lúdicos, parqueadero (propio o contratado) y servicios higiénicos o baterías sanitarias.',
        codeClassification: CatalogueParkClassificationsCodeEnum.permanent_attraction_parks
    },
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Bolera: Persona natural o jurídica que cuenta con un establecimiento en el que se encuentran establecidas zonas para el desarrollo del juego de bolos. Para la prestación del servicio requerirá: pista de bolos, servicios higiénicos o baterías sanitarias, casilleros de seguridad para uso del visitante.',
        codeClassification: CatalogueParkClassificationsCodeEnum.bowling_alley
    },
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Pista de patinaje: Persona natural o jurídica que cuenta con un establecimiento para la prestación del servicio de patinaje. Para la prestación del servicio requerirá: pista de patinaje, alquiler de patines, servicios higiénicos o baterías sanitarias.',
        codeClassification: CatalogueParkClassificationsCodeEnum.skating_rink
    },
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Termas: Persona natural o jurídica que cuenta con un establecimiento que para la prestación del servicio requerirá de: piscina(s) con agua natural termal en un área delimitada cuyos componentes minerales y temperaturas son superiores a la media ambiental y que podrían tener propiedades terapéuticas. Contará con vestidores diferenciados, casillero de seguridad para uso del visitante, servicios higiénicos o baterías sanitarias.',
        codeClassification: CatalogueParkClassificationsCodeEnum.hot_springs
    },
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Balnearios: Persona natural o jurídica que cuenta con un establecimiento que oferta como actividad principal el servicio de piscinas. Para la prestación del servicio requerirá: infraestructura permanente de piscinas, vestidores diferenciados, servicios higiénicos o baterías sanitarias, casilleros de seguridad para uso del visitante.',
        codeClassification: CatalogueParkClassificationsCodeEnum.beach_resorts
    },
    {
        // classification: 'Parques de Atracciones Turisticas',
        definition:
            'Centro de recreación turística: Persona natural o jurídica que cuenta con un establecimiento con infraestructura e instalaciones determinadas para ofrecer el servicio de recreación, orientados a la diversión y relajación. Para la prestación del servicio requerirá: servicios higiénicos o baterías sanitarias, parqueaderos, y contará con al menos uno de los siguientes elementos: canchas deportivas, juegos infantiles, juegos al aire libre o bajo techo, área de picnic/BBQ, y otros que se relacionen a la actividad turística.',
        codeClassification: CatalogueParkClassificationsCodeEnum.tourist_recreation_centers
    },
];
export const items: Item[] = [
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC), número de Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE), u otro que determine la Autoridad Tributaria, en la que consten los datos informativos correspondientes a razón social, el nombre comercial, número del local, dirección y actividad del establecimiento del que se obtendrá el Registro de Turismo.',
        person: 'natural'
    },
    {
        label: 'Documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad y/o modalidad turística.',
        person: 'juridica'
    },
    {
        label: 'Al momento de la inspección presentará el Registro Único de Contribuyentes (RUC) o Régimen Simplificado para Emprendedores y Negocios Populares (RIMPE) en el que conste la actividad regulada en este Reglamento. ',
        person: 'juridica'
    },
];
