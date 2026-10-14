import { CatalogueInterface, DpaInterface } from '@utils/interfaces';

export interface DocumetnValidatorState {
    documetnValidatorData: DocumetnValidatorData;
}

export interface DocumetnValidatorData {
    registerNumber: string;
}

export const INITIAL_STATE: DocumetnValidatorState = {
    documetnValidatorData: {
        registerNumber: ''
    }
};

export const DOCUMENT_VALIDATOR_DATA_KEYS = ['registerNumber'] as const satisfies (keyof DocumetnValidatorData)[];

type SectionKeysMap = {
    [K in keyof DocumetnValidatorState]: readonly (keyof DocumetnValidatorState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    documetnValidatorData:DOCUMENT_VALIDATOR_DATA_KEYS
};


