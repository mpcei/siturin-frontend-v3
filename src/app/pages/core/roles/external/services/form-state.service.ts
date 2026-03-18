import { Injectable, signal, effect, computed } from '@angular/core';
import { EstablishmentAddressInterface, EstablishmentInterface, ProcessInterface, RucInterface } from '@/pages/core/shared/interfaces';

export interface AppFormState {
    establishment: EstablishmentInterface | null;
    process: ProcessInterface | null;
    ruc: RucInterface | null;
    civilRegistry: ProcessInterface | null;
    guideInformation: any | null;
    establishmentAddress: EstablishmentAddressInterface | null;
}

const STORAGE_KEY = 'formState';
const INITIAL_STATE: AppFormState = { ruc: null, civilRegistry: null, establishment: null, process: null, guideInformation: null, establishmentAddress: null };

@Injectable({ providedIn: 'root' })
export class FormStateService {
    readonly formState = signal<AppFormState>(this.loadFromStorage());

    readonly establishment = computed(() => this.formState().establishment);
    readonly process = computed(() => this.formState().process);
    readonly guideInformation = computed(() => this.formState().guideInformation);
    readonly establishmentAddress = computed(() => this.formState().establishmentAddress);

    constructor() {
        effect(() => {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.formState()));
        });
    }

    updateSection<K extends keyof AppFormState>(section: K, data: AppFormState[K]) {
        this.formState.update((state) => ({
            ...state,
            [section]: data
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
