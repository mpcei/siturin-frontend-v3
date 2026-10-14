import { computed, effect, Injectable, signal } from '@angular/core';
import { DocumetnValidatorState, INITIAL_STATE, SECTION_KEYS } from './document-validator.state';
import { pickKeys } from '@/utils/helpers/pickKeys.helper';
import { CatastroModel } from '@/legacy/models/siturin';

const FORM_STATE_KEY = 'formState';

@Injectable({ providedIn: 'root' })
export class DocumentValidatorStore {
    readonly formState = signal<DocumetnValidatorState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    loaded = signal<boolean>(false);
    catastro = signal<CatastroModel | null>(null);

    readonly documetnValidatorData = computed(() => this.formState().documetnValidatorData);

    constructor() {
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
        });
    }

    updateSection<K extends keyof DocumetnValidatorState>(section: K, data: Partial<DocumetnValidatorState[K]>) {
        const allowedKeys = SECTION_KEYS[section];
        const filtered = pickKeys(data, allowedKeys);

        this.formState.update((state) => ({
            ...state,
            [section]: {
                ...state[section],
                ...filtered
            }
        }));
    }

    private loadFromStorage(): DocumetnValidatorState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }

    reset(): void {
        this.formState.set(INITIAL_STATE);
        this.formErrors.set({});
        sessionStorage.removeItem(FORM_STATE_KEY);
    }
}
