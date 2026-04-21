import { CatalogueActivitiesGeographicAreaEnum } from '@utils/enums';

export function validateDegreeType(degrees: any[], geographicAreaCode: string): string | null {

    if (degrees.length > 0) {
        if (degrees.every((item) => item.level === 'Bachiller')) {
            return 'bachiller';
        }

        const normalize = (text: string) =>
            text
                .normalize('NFD') // separa letras y tildes
                .replace(/[\u0300-\u036f]/g, '') // elimina tildes
                .toLowerCase();

        const thirdLevelDegrees = degrees.filter((item) => {
            return ['tercer', 'tercero', 'tecnico', 'tecnologo'].some((word) => normalize(item.level).includes(word));
        });

        let guideTourismDegrees = [];

        switch (geographicAreaCode) {
            case CatalogueActivitiesGeographicAreaEnum.continent:
                guideTourismDegrees = thirdLevelDegrees.filter((item) => normalize(item.name).includes('guia'));
                break;

            case CatalogueActivitiesGeographicAreaEnum.galapagos:
                guideTourismDegrees = thirdLevelDegrees.filter((item) => ['guia', 'turismo'].some((word) => normalize(item.name).includes(word)));
                break;
        }

        if (guideTourismDegrees.length > 0) {
            return 'guide';
        }

        if (thirdLevelDegrees.length === 0) {
            return 'bachiller';
        }

        const hasMatch = true;

        if (hasMatch) return 'related';

        return 'bachiller';
    }

    return null;
}
