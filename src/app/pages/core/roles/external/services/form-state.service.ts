import { Injectable, signal, effect, computed } from '@angular/core';
import { EstablishmentAddressInterface, EstablishmentInterface, ProcessInterface, RucInterface } from '@/pages/core/shared/interfaces';

export interface AppFormState {
    establishment: EstablishmentInterface | null;
    establishmentTemp: EstablishmentInterface | null;
    process: ProcessInterface | null;
    processTemp: ProcessInterface | null;
    processGuides: any[];
    ruc: RucInterface | null;
    civilRegistry: ProcessInterface | null;
    user: any | null;
    userTemp: any | null;
    establishmentAddress: EstablishmentAddressInterface | null;
    files: any[];
}

const STORAGE_KEY = 'formState';
const INITIAL_STATE: AppFormState = {
    ruc: null,
    civilRegistry: null,
    establishment: null,
    establishmentTemp: null,
    process: null,
    processTemp: null,
    processGuides: [],
    user: null,
    userTemp: null,
    establishmentAddress: null,
    files: []
};

@Injectable({ providedIn: 'root' })
export class FormStateService {
    readonly formState = signal<AppFormState>(this.loadFromStorage());

    readonly establishment = computed(() => this.formState().establishment);
    readonly establishmentTemp = computed(() => this.formState().establishmentTemp);
    readonly process = computed(() => this.formState().process);
    readonly processTemp = computed(() => this.formState().processTemp);
    readonly processGuides = computed(() => this.formState().processGuides);
    readonly user = computed(() => this.formState().user);
    readonly userTemp = computed(() => this.formState().userTemp);
    readonly establishmentAddress = computed(() => this.formState().establishmentAddress);
    readonly files = computed(() => this.formState().files);

    constructor() {
        effect(() => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.formState()));
        });
    }

    updateSection<K extends keyof AppFormState>(section: K, data: Partial<AppFormState[K]>) {
        this.formState.update((state) => ({
            ...state,
            [section]: {
                ...state[section], // 👈 lo anterior
                ...data // 👈 lo nuevo
            }
        }));
    }

    clearState() {
        this.formState.set(INITIAL_STATE);
        sessionStorage.removeItem(STORAGE_KEY);
    }

    private loadFromStorage(): AppFormState {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
